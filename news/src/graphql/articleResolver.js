const Articles = require("../models/articles");
const { verifyToken } = require("../controllers/authController");
const { ArticleStatusConst } = require("../constant")

module.exports = {
  index: async (root, args, context) => {

    let id = {};
    if (context.headers.authorization) {
      id = await verifyToken(context);
    }

    if (id.UserID) {
      args.UserID = id.UserID;
    }

    let data = await Articles.getArticles({ user: id, args });
    return data;
  },
  getOne: async (root, args, context) => {
    return Articles.find({
      ID: args.ID,
      Status: { $ne: ArticleStatusConst.inActive },
    });
  },

};
