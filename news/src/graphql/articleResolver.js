const Articles = require("../models/articles");
const Users = require("../models/users");
const BlockAuthor = require("../models/block_author");
const { verifyToken } = require("../controllers/authController");
const { ArticleStatusConst } = require("../constant");
const get = require("lodash/get");
const UploadBase64OnS3 = require("../upload/base64_upload");
const { AWSCredentails } = require("../upload/aws_constants");

module.exports = {
  index: async (root, args, context) => {
    let id = {};
    if (context.headers.authorization) {
      id = await verifyToken(context);
    }

    if (id.UserID) {
      args.UserID = id.UserID;
    }

    const findQuery = await buildFindQuery({ args: args.filters });

    let options = {
      limit: args.limit || 10,
      page: args.page || 1,
      $sort: {
        createdAt: -1,
      },
    };

    let data = await Articles.paginate(findQuery, options);
    return data.docs;
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
  const blockedAuthorIds = await queryForBlockedAuthors({ args });
  let query = { $and: [] };

  query.$and.push({ Status: 2 });
  query.$and.push({ isPublish: true });

  if (blockedAuthorIds) {
    query.$and.push({ AuthorID: { $nin: blockedAuthorIds } });
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

  if (get(args, "Slug")) {
    query.$and.push({ Slug: args.Slug });
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
