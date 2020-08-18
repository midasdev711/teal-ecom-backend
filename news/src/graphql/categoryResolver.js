const { verifyToken } = require("../controllers/authController");
const { ArticleStatusConst } = require("../constant");
const Category = require("../models/categories");
const get = require("lodash/get");

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
    let data = await Category.find(findQuery);
    return data;
  },
  upsert: async (root, args, context) => {
    const id = await verifyToken(context);

    let attributes = get(args, "category");

    let category = await Category.findOne({ ID: attributes.ID });

    if (category) {
      return Category.update(args);
    } else {
      return Category.create(attributes);
    }
  },
};

const buildFindQuery = async ({ args }) => {
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
