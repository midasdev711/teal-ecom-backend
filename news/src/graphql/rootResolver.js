const ArticleResolver = require("./articleResolver");
const CategoryResolver = require("./categoryResolver");
const UserResolver = require("./userResolver");
const AuthResolver = require("./authResolver");

const root = {
  Query: {
    articles: ArticleResolver.index,
    categories: CategoryResolver.index,
    users: UserResolver.index,
    auth: AuthResolver.index,
  },
  Mutation: {
    upsertArticle: ArticleResolver.upsert,
    upsertCategory: CategoryResolver.upsert,
    upsertUser: UserResolver.upsert,
    upsertAuth: AuthResolver.upsert,
  },
};

module.exports = root;
