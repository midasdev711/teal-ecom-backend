const ArticleResolver = require("./articleResolver");

const root = {
  Query: {
    articles: ArticleResolver.index,
  },
  Mutation: {
    upsertArticle: ArticleResolver.upsert
  },
};

module.exports = root;
