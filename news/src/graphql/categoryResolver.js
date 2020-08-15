const { verifyToken } = require("../controllers/authController");
const { ArticleStatusConst } = require("../constant");
const Category = require("../models/categories");

module.exports = {
  index: async (root, args, context) => {
    let data = await Category.getCategories({ args });
    return data;
  },
};
