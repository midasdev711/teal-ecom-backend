const ArticleResolver = require("./articleResolver");
const CategoryResolver = require("./categoryResolver");
const root = {
  Query: {
    articles: ArticleResolver.index,
    article: ArticleResolver.getOne,
    categories: CategoryResolver.index,
  },
  // Mutation: {},
};

module.exports = root;
