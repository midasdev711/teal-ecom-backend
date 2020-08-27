const ArticleResolver = require("./articleResolver");
const CategoryResolver = require("./categoryResolver");
const UserResolver = require("./userResolver");
const AuthResolver = require("./authResolver");
const articleResolver = require("./articleResolver");
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
    upsertAuth: AuthResolver.upsert,
    userAPIKey: AuthResolver.createAPIKey,
    upsertArticleRating: ArticleResolver.articleRating,
    upsertArticleBookmark: ArticleResolver.articleBookmark,
  },
};

module.exports = root;
