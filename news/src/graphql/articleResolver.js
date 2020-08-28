const Articles = require("../models/articles");
const Users = require("../models/users");
const BlockAuthor = require("../models/block_author");
const {
  SubTitleMaxLen,
  TitleMaxLen,
  ArticleStatusConst,
  RoleObject,
  PremiumContentLen,
  SubscribeCdnUrl,
} = require("../constant");
const get = require("lodash/get");
const UploadBase64OnS3 = require("../upload/base64_upload");
const { AWSNewCredentials } = require("../upload/aws_constants");
const UsersPaidSubscriptions = require("../models/users_paid_subscriptions");
const ArticleClickDetails = require("../models/article_click_details");
const FollowAuthor = require("../models/follow_author");
const ArticleBookmarks = require("../models/bookmarks");
const ArticleRatings = require("../models/article_rating");
const uniqid = require("uniqid");

module.exports = {
  index: async (root, args, context) => {
    if (context.userAuthenticate) {
      if (context.apiKey) {
        let arrID = context.apiKey.split("_");
        let arrDomain = context.apiKey.split("%");
        if (arrDomain[0] == "teal.com") args.UserID = arrID[1];
      } else {
        args.UserID = null;
      }
    }
    const findQuery = await buildFindQuery({
      args: args.filters,
      UserID: args.UserID,
    });
    // user object can be from apollo server context.user check if this is null
    console.log(findQuery);
    let data = await Articles.aggregate(findQuery);

    articleData = data[0].data;

    if (articleData) {
      if (get(args.filters, "slug")) {
        if (
          articleData[0].articleScope == 2 &&
          args.UserID != articleData[0].authorID
        )
          articleData = await calculateSubscribeContent(args, articleData);
        await updateViewCount(args.filters, args.UserID);

        if (get(args.filters, "userID")) {
          await Promise.all(
            articleData.map(async (data) => {
              return Promise.all([
                getBookMarkCount(data, args),
                getFollowAuthorCount(data, args),
              ]).then(function (values) {
                data.isBookmark = values[0] == 1;
                data.isFollowed = values[1] == 1;
              });
            })
          );
        } else {
          articleData[0].isBookmark = false;
          articleData[0].isFollowed = false;
        }
        if (get(articleData[0], "SubTitle")) {
          if (get(articleData[0], "Description")) {
            articleData[0].subTitle = articleData[0].description.replace(
              /(<([^>]+)>)/gi,
              ""
            );
            articleData[0].subTitle =
              articleData[0].subTitle.substring(0, subTitleMaxLen) + "....";
          }
        }
        await articleData;
      }
    }
    return articleData;
  },

  upsert: async (root, args, context) => {
    let attributes = get(args, "article");
    console.log(args);

    let article = await Articles.findOne({ ID: attributes.ID });

    if (article) {
      return Articles.update(attributes);
    } else {
      attributes.slug = uniqid(Date.now());
      if (get(args, "title")) {
        attributes.titleSlug = formatString(attributes.title);
        attributes.ampSlug = formatString(attributes.title);
      }

      if (get(attributes, "featureImage")) {
        attributes.featureImage = await uploadFeaturedImage(
          attributes.featureImage,
          attributes.slug
        );
      }

      if (get(attributes, "description")) {
        attributes.description = await uploadDescriptionImagesOnS3(
          attributes.description
        );
      }
      attributes.ampSlug = `amp/${attributes.slug}`;

      return Articles.create(attributes);
    }
  },

  articleRating: async (root, args, context) => {
    args = args.articleRating;
    console.log(args);

    if (typeof args.userID != "undefined" && args.userID != 0) {
      return ArticleRatings.find({
        articleID: args.articleID,
        userID: args.userID,
        status: 1,
      }).then(async (rating) => {
        if (rating.length == 0) {
          let ArticleClapCountConstant = new ArticleRatings({
            description: args.userID + "user-aritcle" + args.articleID,
            userID: args.userID,
            articleID: args.articleID,
            clapCount: 1,
          });

          await Articles.updateOne(
            { $and: [{ ID: args.articleID }, { status: { $ne: 0 } }] },
            { $inc: { totalClapCount: 1 } },
            { upsert: true, returnOriginal: true }
          );

          return await ArticleClapCountConstant.save();
        } else {
          await Articles.updateOne(
            { $and: [{ ID: args.articleID }, { status: { $ne: 0 } }] },
            { $inc: { totalClapCount: -1 } },
            { upsert: true, returnOriginal: true }
          );

          return await ArticleRatings.findOneAndUpdate(
            {
              $and: [
                { articleID: args.articleID },
                { userID: args.userID },
                { status: 1 },
              ],
            },
            { $set: { status: 0 } },
            { new: true, returnNewDocument: true }
          );
        }
      });
    } else throw new Error("Please login to continue");
  },

  articleBookmark: async (root, args, context) => {
    args = args.articleBookmark;

    if (typeof args.userID != "undefined" && args.userID != 0) {
      let BookmarkConstant = new ArticleBookmarks({
        articleID: args.articleID,
        userID: args.userID,
      });

      return ArticleBookmarks.findOne({
        $and: [
          { articleID: args.articleID },
          { userID: args.userID },
          { status: 1 },
        ],
      })
        .then((result) => {
          if (result == null) return BookmarkConstant.save();
          else {
            return ArticleBookmarks.findOneAndUpdate(
              {
                articleID: args.articleID,
                userID: args.userID,
                status: 1,
              },
              { $set: { status: 0 } },
              { new: true, returnNewDocument: true }
            );
          }
        })
        .catch((err) => {
          return err;
        });
    } else throw new Error("Please login to continue");
  },
};

const uploadFeaturedImage = (ImageBase64, Slug) => {
  return UploadBase64OnS3(
    ImageBase64,
    AWSNewCredentials.AWS_USER_IMG_PATH,
    Slug
  );
};

// upload image inside description string on aws, replace the aws return url in description
async function uploadDescriptionImagesOnS3(Description) {
  const DescImageObject = await getBlobImageObject(Description);
  const UrlLen = DescImageObject.length;
  const base = /base64/g;

  for (var i = 0; i < UrlLen; i++) {
    if (base.exec(DescImageObject[i]) != null) {
      desc = await UploadBase64OnS3(
        DescImageObject[i],
        AWSCredentails.AWS_STORIES_IMG_PATH
      );
      Description = Description.replace(DescImageObject[i], desc);
    }
  }
  return Description;
}

// get image base64 image object from description field
async function getBlobImageObject(DescriptionString) {
  let m;
  let urls = [];
  const base = /base64/g;
  const rex = /img.*?src='(.*?)'/g;
  const rexd = /img.*?src='(.*?)'/g;
  if (base.exec(DescriptionString) != null) {
    if (DescriptionString.indexOf('"') >= 0) {
      while ((m = rexd.exec(DescriptionString))) {
        urls.push(m[1]);
      }
    } else {
      while ((m = rex.exec(DescriptionString))) {
        urls.push(m[1]);
      }
    }
  }
  return await urls;
}

const buildFindQuery = async ({ args, UserID }) => {
  const blockedAuthorIds = await queryForBlockedAuthors({ args });
  let query = { $and: [] };

  query.$and.push({ status: 2 });
  query.$and.push({ isPublish: true });

  if (get(args, "blockedAuthorIds")) {
    query.$and.push({ authorID: { $nin: blockedAuthorIds } });
  }

  if (get(args, "slug")) {
    query.$and.push({ slug: args.slug, articleScope: { $ne: 0 } });
  }

  if (get(args, "articleIds")) {
    query.$and.push({ ID: { $in: get(args, "articleIds") } });
  }

  if (get(args, "articleId")) {
    query.$and.push({ ID: parseInt(args.articleId) });
  }

  if (get(args, "ignoreArticleIds")) {
    query.$and.push({ ID: { $nin: get(args, "ignoreArticleIds") } });
  }

  if (get(args, "authorUserName")) {
    args.authorUserName = args.authorUserName.trim();
    const AuthorDetails = await Users.findOne({
      status: 1,
      userName: args.authorUserName,
    });
    if (AuthorDetails) {
      args.authorID = AuthorDetails.ID;
    }
    query.$and.push({ status: 2 });
    query.$and.push({ articleScope: 1 });
  }

  if (get(args, "isPopular")) {
    query.$and.push({ status: articleStatusConst.approved });
  }

  let aggregate = [{ $match: query }];

  aggregate.push({
    $lookup: {
      from: "users",
      localField: "authorID",
      foreignField: "ID",
      as: "author",
    },
  });

  if (UserID) {
    aggregate.push({ $match: { "author.ID": parseInt(UserID) } });
  }

  aggregate.push({
    $facet: {
      data: [
        { $sort: { createdAt: -1 } },
        { $skip: parseInt(args.page) - 1 || 0 },
        { $limit: parseInt(args.limit) || 10 },
      ],
      pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
    },
  });
  return aggregate;
};

const queryForBlockedAuthors = async ({ args }) => {
  const blockedAuthor = await BlockAuthor.find(
    { userID: args.UserID, Status: 0 },
    { AuthorID: 1, _id: 0 }
  );

  if (!blockedAuthor) {
    return [];
  }

  return blockedAuthor.map((ID) => ID.AuthorID);
};

const formatString = (str) => {
  return str
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "")
    .trim()
    .replace(/[^a-zA-Z0-9-. ]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
};

async function calculateSubscribeContent(args, lor) {
  if (get(lor[0], "articleScope") == 2) {
    if (get(args.filters, "userID")) {
      if ((await checkUserSubscription(args, lor[0].authorID)) <= 0) {
        lor[0].description =
          lor[0].description.substring(0, PremiumContentLen) +
          ' <img src="' +
          SubscribeCdnUrl +
          '">';
        lor[0].isContentAllowed = false;
      } else lor[0].isContentAllowed = true;
    } else {
      lor[0].isContentAllowed = false;
      lor[0].description =
        lor[0].description.substring(0, PremiumContentLen) +
        ' <img src="' +
        SubscribeCdnUrl +
        '">';
    }
  }
  return await lor;
}

async function checkUserSubscription(args, AuthorID) {
  return UsersPaidSubscriptions.findOne({
    $and: [
      { authorID: AuthorID },
      { status: { $ne: 0 } },
      { userID: args.filters.userID },
      { endDate: { $gte: new Date() } },
    ],
  }).countDocuments();
}

async function updateViewCount(args, userID) {
  Articles.updateOne(
    { $and: [{ slug: args.slug }] },
    { $inc: { viewCount: 1 } },
    { new: true }
  ).then((w) => {
    return w;
  });
  if (typeof userID != "undefined" && userID != null && userID != 0) {
    updateArticleClickDetails(args);
  }
}

async function updateArticleClickDetails(args) {
  let ClickData = {};
  Articles.findOne({ slug: args.slug }).then((data) => {
    ClickData.articleID = data.ID;
    ClickData.userID = args.filters.userID;
    ClickData.authorID = data.authorID;
    ClickData.slug = args.slug;
    ClickData.articleTitle = data.title;
    ArticleClickDetails.create(ClickData);
  });
}

async function getBookMarkCount(data, args) {
  return ArticleBookmarks.find({
    articleID: data.ID,
    userID: args.filters.userID,
    status: 1,
  }).countDocuments();
}

async function getFollowAuthorCount(data, args) {
  return FollowAuthor.find({
    authorID: data.AuthorID,
    userID: args.filters.UserID,
    status: 1,
    isFollowed: true,
  }).countDocuments();
}
