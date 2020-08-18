const ArticleResolver = require("./articleResolver");
const CategoryResolver = require("./categoryResolver");
const UserResolver = require("./userResolver");
const AuthResolver = require("./authResolver");

const root = {
  Query: {
    articles: ArticleResolver.index,
    categories: CategoryResolver.index,
    users: UserResolver.index,
    auth: AuthResolver,
  },
  Mutation: {
    upsertArticle: ArticleResolver.upsert,
    upsertCategory: CategoryResolver.upsert,
    upsestUser: UserResolver.upsert,
  },
};

module.exports = root;
