const ArticleResolver = require("./articleResolver");
const CategoryResolver = require("./categoryResolver");
const UserResolver = require("./userResolver");
const AuthResolver = require("./authResolver");
const UserSettingResolver = require("./userSettingResolver");
const articleResolver = require("./articleResolver");
const root = {
  Query: {
    articles: ArticleResolver.index,
    uploadArticles: articleResolver.uploadArticles,
    categories: CategoryResolver.index,
    users: UserResolver.index,
    auth: AuthResolver.index,
    userSetting: UserSettingResolver.index,
  },
  Mutation: {
    upsertArticle: ArticleResolver.upsert,
    upsertCategory: CategoryResolver.upsert,
    upsertAuth: AuthResolver.upsert,
    userAPIKey: AuthResolver.createAPIKey,
    upsertArticleRating: ArticleResolver.articleRating,
    upsertArticleBookmark: ArticleResolver.articleBookmark,
    upsertUserSetting: UserSettingResolver.upsert,
  },
};

module.exports = root;
