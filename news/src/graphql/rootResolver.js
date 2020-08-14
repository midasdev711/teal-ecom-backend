const ArticleResolver = require("./articleResolver");
const root = {
  Query: {
    articles: ArticleResolver.index,
  },
  // Mutation: {},
};

module.exports = root;
