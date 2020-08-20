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
    console.log(args);
    const findQuery = await buildFindQuery({ args: args.filters });

    // user object can be from apollo server context.user check if this is null
    let options = {
      limit: args.filters.limit || 10,
      page: args.filters.page || 1,
      $sort: {
        createdAt: -1,
      },
    };

    let data = await Articles.paginate(findQuery, options);

    articleData = data.docs;
    if (get(args.filters, "Slug")) {
      if (
        articleData[0].ArticleScope == 2 &&
        args.UserID != articleData[0].AuthorID
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
          articleData[0].SubTitle = articleData[0].Description.replace(
            /(<([^>]+)>)/gi,
            ""
          );
          articleData[0].SubTitle =
            articleData[0].SubTitle.substring(0, SubTitleMaxLen) + "....";
        }
      }
      await articleData;
    }
    return articleData;
  },

  upsert: async (root, args, context) => {
    const id = await verifyToken(context);

    let attributes = get(args, "article");
    if (id.UserID) {
      attributes.AuthorID = id.UserID;
    }

    if (get(args, "Title")) {
      const title = args.Title;
      attributes.TitleSlug = formatString(attributes.Title);
      attributes.AmpSlug = formatString(attributes.Title);
    }

    if (get(attributes, "FeatureImage")) {
      attributes.FeatureImage = await uploadFeaturedImage(
        attributes.FeatureImage,
        attributes.Slug
      );
    }

    if (get(attributes, "Description")) {
      attributes.Description = await uploadDescriptionImagesOnS3(
        attributes.Description
      );
    }

    let article = await Articles.findOne({ ID: attributes.ID });

    if (article) {
      return Articles.update(args);
    } else {
      attributes.Slug = uniqid(Date.now());
      attributes.AmpSlug = `amp/${attributes.Slug}`;

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

const buildFindQuery = async ({ args }) => {
  // const blockedAuthorIds = await queryForBlockedAuthors({ args });
  let query = { $and: [] };

  query.$and.push({ Status: 2 });
  query.$and.push({ isPublish: true });

  if (get(args, "blockedAuthorIds")) {
    query.$and.push({ AuthorID: { $nin: blockedAuthorIds } });
  }

  if (get(args, "Slug")) {
    query.$and.push({ Slug: args.Slug, ArticleScope: { $ne: 0 } });
  }

  if (get(args, "articleIds")) {
    query.$and.push({ ID: { $in: get(args, "articleIds") } });
  }

  if (get(args, "ignoreArticleIds")) {
    query.$and.push({ ID: { $nin: get(args, "ignoreArticleIds") } });
  }

  if (get(args, "AuthorUserName")) {
    args.AuthorUserName = args.AuthorUserName.trim();
    const AuthorDetails = await Users.findOne({
      Status: 1,
      UserName: args.AuthorUserName,
    });
    if (AuthorDetails) {
      args.AuthorID = AuthorDetails.ID;
    }
    query.$and.push({ Status: 2 });
    query.$and.push({ ArticleScope: 1 });
  }

  if (get(args, "isPopular")) {
    query.$and.push({ Status: ArticleStatusConst.Approved });
  }
  return query;
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
  if (get(lor[0], "ArticleScope") == 2) {
    if (get(args, "UserID")) {
      if ((await checkUserSubscription(args, lor[0].AuthorID)) <= 0) {
        lor[0].Description =
          lor[0].Description.substring(0, PremiumContentLen) +
          ' <img src="' +
          SubscribeCdnUrl +
          '">';
        lor[0].isContentAllowed = false;
      } else lor[0].isContentAllowed = true;
    } else {
      lor[0].isContentAllowed = false;
      lor[0].Description =
        lor[0].Description.substring(0, PremiumContentLen) +
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
    { $and: [{ Slug: args.Slug }] },
    { $inc: { ViewCount: 1 } },
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
  Articles.findOne({ Slug: args.Slug }).then((data) => {
    ClickData.ArticleID = data.ID;
    ClickData.UserID = args.UserID;
    ClickData.AuthorID = data.AuthorID;
    ClickData.Slug = args.Slug;
    ClickData.ArticleTitle = data.Title;
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
