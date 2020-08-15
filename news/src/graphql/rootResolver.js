const ArticleResolver = require("./articleResolver");
const root = {
  Query: {
    articles: ArticleResolver.index,
    article: ArticleResolver.getOne,
  },
  // Mutation: {},
};

module.exports = root;
