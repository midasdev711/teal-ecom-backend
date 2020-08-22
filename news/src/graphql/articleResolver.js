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
const { AWSCredentails } = require("../upload/aws_constants");
const UsersPaidSubscriptions = require("../models/users_paid_subscriptions");
const ArticleClickDetails = require("../models/article_click_details");
const FollowAuthor = require("../models/follow_author");
const ArticleBookmarks = require("../models/bookmarks");

module.exports = {
  index: async (root, args, context) => {
    if (context.userAuthenticate) {
      if (context.APIKey) {
        let arrID = context.APIKey.split("_");
        let arrDomain = context.APIKey.split("%");
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

        if (get(args.filters, "UserID")) {
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
    const id = await verifyToken(context);

    let attributes = get(args, "article");
    if (id.UserID) {
      attributes.authorID = id.UserID;
    }

    if (get(args, "title")) {
      const title = args.title;
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

    let article = await Articles.findOne({ ID: attributes.ID });

    if (article) {
      return Articles.update(args);
    } else {
      attributes.slug = uniqid(Date.now());
      attributes.ampSlug = `amp/${attributes.slug}`;

      return Articles.create(attributes);
    }
  },
};

const uploadFeaturedImage = (ImageBase64, Slug) => {
  return UploadBase64OnS3(ImageBase64, AWSCredentails.AWS_USER_IMG_PATH, Slug);
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
    console.log("object");
    query.$and.push({ slug: args.slug, articleScope: { $ne: 0 } });
  }

  if (get(args, "articleIds")) {
    query.$and.push({ ID: { $in: get(args, "articleIds") } });
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
    { UserID: args.UserID, Status: 0 },
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
    if (get(args, "userID")) {
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
      { AuthorID: AuthorID },
      { Status: { $ne: 0 } },
      { UserID: args.UserID },
      { EndDate: { $gte: new Date() } },
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
    ClickData.userID = args.userID;
    ClickData.authorID = data.authorID;
    ClickData.slug = args.slug;
    ClickData.articleTitle = data.title;
    ArticleClickDetails.create(ClickData);
  });
}

async function getBookMarkCount(data, args) {
  return ArticleBookmarks.find({
    ArticleID: data.ID,
    UserID: args.UserID,
    Status: 1,
  }).countDocuments();
}

async function getFollowAuthorCount(data, args) {
  return FollowAuthor.find({
    AuthorID: data.AuthorID,
    UserID: args.UserID,
    Status: 1,
    isFollowed: true,
  }).countDocuments();
}
