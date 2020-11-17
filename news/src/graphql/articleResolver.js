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
const UploadArticlesOnS3 = require("../upload/upload_articles");
const { AWSNewCredentials } = require("../upload/aws_constants");
const UsersPaidSubscriptions = require("../models/users_paid_subscriptions");
const ArticleClickDetails = require("../models/article_click_details");
const FollowAuthor = require("../models/follow_author");
const ArticleBookmarks = require("../models/bookmarks");
const ArticleRatings = require("../models/article_rating");
const uniqid = require("uniqid");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
var AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const user = require("../models/users");
const { verifyToken } = require("../controllers/authController");

module.exports = {
  index: async (root, args, context) => {
    if (context.userAuthenticate) {
      if (context.apiKey) {
        let arrID = context.apiKey.split("_");
        let arrDomain = context.apiKey.split("%");
        if (arrDomain[0] == "juicypie.com") args.UserID = arrID[1];
      } else {
        args.UserID = null;
      }
    }

    if (
      get(args.filters, "userId") &&
      !args.filters.articleId &&
      !args.filters.slug
    ) {
      let data = await Articles.find()
        .sort({ ID: -1 })
        .limit(10)
        .select({ ID: 1, _id: 0 });
      let IdArray = [];
      await data.map((x) => {
        IdArray.push(x.ID);
      });
      let articlesArray = await predictArticles(IdArray);
      articlesArray.push(IdArray[0]);
      console.log("data", articlesArray);
      // args.filters.articleIds = articlesArray;
    }

    if (
      get(args.filters, "userId") &&
      (args.filters.articleId || args.filters.slug)
    ) {
      let IdArray = [];
      if (args.filters.articleId) IdArray.push(args.filters.articleId);
      if (args.filters.slug) {
        let data = await Articles.findOne({ slug: args.filters.slug });
        IdArray.push(data.ID);
      }
      await predictArticles(IdArray);
    }

    const findQuery = await buildFindQuery({
      args: args.filters,
      UserID: args.UserID,
    });
    // user object can be from apollo server context.user check if this is null
    let data = await Articles.aggregate(findQuery);
    articleData = data[0].data;

    if (articleData && articleData.length) {
      if (get(args.filters, "userId")) {
        await Promise.all(
          articleData.map(async (data) => {
            return Promise.all([
              checkClapCountForUser(data, args),
              getFollowAuthorCount(data, args),
              getBookMarkCount(data, args),
            ]).then(function (values) {
              for (let i = 0; i < 3; i++) {
                if (i == 0) {
                  if (values[i]) data.isArticleLiked = true;
                  else data.isArticleLiked = false;
                }
                if (i == 2) {
                  if (values[i]) data.isBookmark = values[i] == 1;
                  else data.isBookmark = false;
                }
                if (i == 1) {
                  if (values[i]) data.isFollowed = values[i] == 1;
                  else data.isFollowed = false;
                }
              }
            });
          })
        );
      }

      if (get(args.filters, "slug")) {
        if (
          articleData[0].articleScope == 2 &&
          args.UserID != articleData[0].authorID
        )
          articleData = await calculateSubscribeContent(args, articleData);
        await updateViewCount(args.filters, args.UserID);

        if (get(args.filters, "userId")) {
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

        await Promise.all(
          articleData.map(async (data) => {
            return Promise.all([getClapCountUser(data, args)]).then(function (
              values
            ) {
              if (values && values.length) {
                values.map(async (x) => {
                  if (x.length) {
                    data.clapCountUser = x[0].users;
                  }
                });
              }
            });
          })
        );

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
    try {
      const id = await verifyToken(context);
      let attributes = get(args, "article");

      if (get(attributes, "deleteArticleIds")) {
        console.log("asdadsasd", attributes.deleteArticleIds);
        attributes.deleteArticleIds.map(async (x) => {
          await Articles.findOneAndUpdate(
            { ID: parseInt(x) },
            { $set: { status: 0 } },
            { multi: true }
          );
        });
        return;
      } else {
        let article = await Articles.findOne({ ID: attributes.articleId });
        // attributes.slug = uniqid(Date.now());
        if (article) {
          let featuredData = null;

          featuredData = await attributes.featureImage;
          if (featuredData) {
            let deleteFeaturedImg;
            deleteFeaturedImg = article.featureImage;

            //remove image from aws
            if (deleteFeaturedImg) {
              deleteFeaturedImg = deleteFeaturedImg.substr(
                deleteFeaturedImg.lastIndexOf("/") + 1
              );
              await removeImageFromAWS(deleteFeaturedImg, "users");
            }

            //upload to aws
            let featuredImgUrl = await uploadUrl(
              featuredData.filename,
              featuredData.createReadStream,
              featuredData.mimetype,
              AWSNewCredentials.AWS_USER_IMG_PATH,
              article.slug
            );
            attributes.featureImage = featuredImgUrl;
          } else if (attributes.featureImage === null) {
            attributes.featureImage = article.featureImage;
          }

          if (attributes.tags && attributes.tags.length > 5) {
            throw new Error("You can enter maximum 5 tags");
          }

          if (attributes.article_SEO) {
            for await (let mSeoObj of attributes.article_SEO) {
              if (
                mSeoObj.metaTitle === "" ||
                mSeoObj.metaTitle === undefined ||
                mSeoObj.metaTitle === null
              ) {
                mSeoObj.metaTitle = attributes.title;
              }

              if (
                mSeoObj.metaDescription === null ||
                mSeoObj.metaDescription === "" ||
                mSeoObj.metaDescription === undefined
              ) {
                mSeoObj.metaDescription = attributes.subTitle;
              }
            }
          }

          if (article.authorID === undefined || article.authorID === null) {
            attributes.authorID = id.UserID;
          }

          let articleData = await Articles.findOneAndUpdate(
            { ID: attributes.articleId },
            attributes,
            { new: true }
          );

          articleData = JSON.parse(JSON.stringify(articleData));

          const authorDetails = await user.findOne({ ID: article.authorID });
          let authors = [];
          let authorObj = {
            ID: authorDetails.ID,
            userName: authorDetails.userName,
            avatar: authorDetails.avatar,
            name: authorDetails.name,
          };
          authors.push(authorObj);
          articleData.author = authors;
          return articleData;
        } else {
          attributes.slug = uniqid(Date.now());
          if (get(args, "title")) {
            attributes.titleSlug = formatString(attributes.title);
            attributes.ampSlug = formatString(attributes.title);
          }

          // console.log('args',attributes);
          if (attributes.article_SEO) {
            for await (let mSeoObj of attributes.article_SEO) {
              if (
                mSeoObj.metaTitle === "" ||
                mSeoObj.metaTitle === undefined ||
                mSeoObj.metaTitle === null
              ) {
                mSeoObj.metaTitle = attributes.title;
              }

              if (
                mSeoObj.metaDescription === null ||
                mSeoObj.metaDescription === "" ||
                mSeoObj.metaDescription === undefined
              ) {
                mSeoObj.metaDescription = attributes.subTitle;
              }
            }
          }

          //tags
          if (attributes.tags && attributes.tags.length > 5) {
            throw new Error("You can enter maximum 5 tags");
          }

          let featuredData = null;
          if (get(attributes, "featureImage")) {
            if (attributes.featureImage) {
              featuredData = await attributes.featureImage;
            }

            //upload to aws
            if (featuredData) {
              let featuredImgUrl = await uploadUrl(
                featuredData.filename,
                featuredData.createReadStream,
                featuredData.mimetype,
                AWSNewCredentials.AWS_USER_IMG_PATH,
                attributes.slug
              );
              attributes.featureImage = featuredImgUrl;
            }
            // attributes.featureImage = await uploadFeaturedImage(
            //   attributes.featureImage,
            //   attributes.slug
            // );
          }

          if (get(attributes, "description")) {
            attributes.description = await uploadDescriptionImagesOnS3(
              attributes.description
            );
          }
          attributes.ampSlug = `amp/${attributes.slug}`;
          attributes.status = ArticleStatusConst.Approved;
          if (!attributes.isDraft) attributes.isPublish = true;
          attributes.articleScope = 1;
          attributes.authorID = id.UserID;

          let articleData = await Articles.create(attributes);
          articleData = JSON.parse(JSON.stringify(articleData));
          const authorDetails = await user.findOne({
            ID: articleData.authorID,
          });
          let authors = [];
          let authorObj = {
            ID: authorDetails.ID,
            userName: authorDetails.userName,
            avatar: authorDetails.avatar,
            name: authorDetails.name,
          };
          authors.push(authorObj);
          articleData.author = authors;
          return articleData;
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  articleImageUpload: async (root, args, context) => {
    try {
      let imageData = null;
      if (args.articleImgInput.articleImage) {
        imageData = await args.articleImgInput.articleImage;
        if (imageData !== undefined) {
          let imgUrl = await uploadUrl(
            imageData.filename,
            imageData.createReadStream,
            imageData.mimetype,
            AWSNewCredentials.AWS_USER_IMG_PATH,
            "article"
          );
          return { imgUrl: imgUrl };
        }
      }
    } catch (error) {
      throw Error("error while article image upload", error.message);
    }
  },

  articleImageUpload: async (root, args, context) => {
    try {
      let imageData = null;
      if (args.articleImgInput.articleImage) {
        imageData = await args.articleImgInput.articleImage;
        if (imageData !== undefined) {
          let imgUrl = await uploadUrl(
            imageData.filename,
            imageData.createReadStream,
            imageData.mimetype,
            AWSNewCredentials.AWS_USER_IMG_PATH,
            "article"
          );
          return { imgUrl: imgUrl };
        }
      }
    } catch (error) {
      throw Error("error while article image upload", error.message);
    }
  },

  articleRating: async (root, args, context) => {
    args = args.articleRating;

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

  uploadArticles: async (root, args, context) => {
    let data = await getArticleDataFromAPI();
    await storeData(data);
    await uploadArticlesOnS3(data, "");
  },
};

const uploadArticlesOnS3 = (data, Slug) => {
  return UploadArticlesOnS3(data, AWSNewCredentials.AWS_ARTICLES_PATH, Slug);
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
  let query = { $and: [] };
  if (get(args, "deletedArticlesAuthorId")) {
    query.$and.push({
      authorID: parseInt(args.deletedArticlesAuthorId),
      status: 0,
    });
  } else if (get(args, "getDraft")) {
    if (get(args, "slug")) {
      query.$and.push({ slug: args.slug, isDraft: true });
    } else if (get(args, "userId")) {
      query.$and.push({ authorID: args.userId, isDraft: true });
    } else if (get(args, "articleID")) {
      query.$and.push({ ID: args.articleID, isDraft: true });
    }
  } else {
    // const blockedAuthorIds = await queryForBlockedAuthors({ args });
    query.$and.push({ status: 2 });
    query.$and.push({ isPublish: true });

    if (get(args, "blockedAuthorIds")) {
      query.$and.push({ authorID: { $nin: blockedAuthorIds } });
    }

    if (get(args, "getDraft")) {
      query.$and.push({ authorID: args.userId, isDraft: true });
    }

    if (get(args, "slug")) {
      query.$and.push({ slug: args.slug, articleScope: { $ne: 0 } });
    }

    if (get(args, "authorId")) {
      query.$and.push({ authorID: parseInt(args.authorId) });
    }

    if (get(args, "articleIds")) {
      const dataArray = args.articleIds.map((data) => {
        return parseInt(data);
      });
      query.$and.push({ ID: { $in: dataArray } });
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
        { $sort: { createdDate: -1 } },
        { $skip: (parseInt(args.page) - 1) * parseInt(args.limit) },
        { $limit: parseInt(args.limit) },
      ],
    },
  });
  return aggregate;
};

const queryForBlockedAuthors = async ({ args }) => {
  const blockedAuthor = await BlockAuthor.find(
    { userID: args.userID, Status: 0 },
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
      { userID: args.filters.userId },
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
    ClickData.userID = args.filters.userId;
    ClickData.authorID = data.authorID;
    ClickData.slug = args.slug;
    ClickData.articleTitle = data.title;
    ArticleClickDetails.create(ClickData);
  });
}

async function getBookMarkCount(data, args) {
  return ArticleBookmarks.find({
    articleID: data.ID,
    userID: args.filters.userId,
    status: 1,
  }).countDocuments();
}

async function getFollowAuthorCount(data, args) {
  return FollowAuthor.find({
    authorID: data.AuthorID,
    userID: args.filters.userId,
    status: 1,
    isFollowed: true,
  }).countDocuments();
}

async function getClapCountUser(data, args) {
  return await ArticleRatings.aggregate([
    {
      $match: {
        articleID: data.ID,
        status: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userID",
        foreignField: "ID",
        as: "users",
      },
    },
  ]);
}

async function checkClapCountForUser(data, args) {
  return await ArticleRatings.findOne({
    articleID: data.ID,
    userID: args.filters.userId,
    status: 1,
  });
}

async function predictArticles(data) {
  const POST_URL = `http://3.20.221.224:5000/predict`;
  const response = await fetch(POST_URL, {
    method: "post",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
      "Accept-Charset": "utf-8",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

async function getArticleDataFromAPI(params) {
  const POST_URL = `https://api.knowledia.com/v1/articles/search?count=100`;
  const response = await fetch(POST_URL, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
      "Accept-Charset": "utf-8",
    },
  });
  return await response.json();
}

const storeData = (data, path) => {
  try {
    fs.writeFile("output.json", JSON.stringify(data), "utf8", function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
      console.log("JSON file has been saved.");
    });
    // fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err);
  }
};

const uploadUrl = async (filename, streadData, mimetype, Path, Slug) => {
  AWS.config.setPromisesDependency(require("bluebird"));
  AWS.config.update({
    accessKeyId: AWSNewCredentials.credentials.accessKeyId,
    secretAccessKey: AWSNewCredentials.credentials.secretAccessKey,
    region: AWSNewCredentials.Region,
  });

  let params = {
    Bucket: AWSNewCredentials.Bucket,
    Key:
      Slug === "article"
        ? `${Path}/` + uuidv4() + "." + filename.split(".").pop()
        : `${Path}/` + Slug + "." + filename.split(".").pop(),
    ACL: "public-read",
    Body: streadData(),
    ContentType: mimetype,
  };

  var s3Bucket = new AWS.S3();
  const { Location } = await s3Bucket.upload(params).promise();
  return Location;
};

const removeImageFromAWS = async (filename, imgType) => {
  try {
    AWS.config.setPromisesDependency(require("bluebird"));
    AWS.config.update({
      accessKeyId: AWSNewCredentials.credentials.accessKeyId,
      secretAccessKey: AWSNewCredentials.credentials.secretAccessKey,
      region: AWSNewCredentials.Region,
    });

    var s3Bucket = new AWS.S3();
    let bucketkey = "";

    if (imgType === "users") {
      bucketkey = `users/${filename}`;
    }

    s3Bucket.deleteObject(
      {
        Bucket: AWSNewCredentials.Bucket,
        Key: bucketkey,
      },
      async function (err, data) {
        if (!err) {
          console.log("file deleted sucessfully");
        }
      }
    );
  } catch (error) {
    console.log("error while removing images from aws\n", error.message);
    throw error;
  }
};
