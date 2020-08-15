const ArticleResolver = require("./articleResolver");
const CategoryResolver = require("./categoryResolver");

const root = {
  Query: {
    articles: ArticleResolver.index,
    categories: CategoryResolver.index,
  },
  Mutation: {
    upsertArticle: ArticleResolver.upsert,
    upsertCategory: CategoryResolver.upsert,
  },
};

module.exports = root;
