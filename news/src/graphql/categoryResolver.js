const { verifyToken } = require("../controllers/authController");
const { ArticleStatusConst } = require("../constant");
const Category = require("../models/categories");
const get = require("lodash/get");

module.exports = {
  index: async (root, args, context) => {
    if (context.userAuthenticate) {
      if (context.APIKey) {
        let arr = context.APIKey.split("_");
        args.UserID = arr[1];
      } else {
        args.UserID = null;
      }
    }
    const findQuery = await buildFindQuery({
      args: args.filters,
      UserID: args.UserID,
    });
    let data = await Category.find(findQuery);
    return data;
  },
  upsert: async (root, args, context) => {
    let userAuthenticate = await authenticateRequest(args, context);
    if (!userAuthenticate) {
      return {
        responseCode: 404,
        responseMessage: "Forbidden Access",
      };
    }
    let attributes = get(args, "category");

    let category = await Category.findOne({ ID: attributes.ID });

    if (category) {
      return Category.update(args);
    } else {
      return Category.create(attributes);
    }
  },
};

const buildFindQuery = async ({ args, UserID }) => {
  let query = { $and: [] };

  query.$and.push({ Status: 1 });

  if (get(args, "categoryIds")) {
    query.$and.push({ ID: { $in: get(args, "categoryIds") } });
  }

  if (get(args, "ignoreCategoryIds")) {
    query.$and.push({ ID: { $nin: get(args, "ignoreCategoryIds") } });
  }

  return query;
};
