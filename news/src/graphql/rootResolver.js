const ArticleResolver = require("./articleResolver");
const CategoryResolver = require("./categoryResolver");
const CampaignResolver = require("./campaignResolver");
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
    socialAuth: AuthResolver.socialAuth,
    userSetting: UserSettingResolver.index,
    campaign: CampaignResolver.index
  },
  Mutation: {
    upsertArticle: ArticleResolver.upsert,
    upsertCategory: CategoryResolver.upsert,
    upsertAuth: AuthResolver.upsert,
    userAPIKey: AuthResolver.createAPIKey,
    sendEmailVerifyCode: AuthResolver.sendEmailVerifyCode,
    sendMobileVerifyCode: AuthResolver.sendMobileVerifyCode,
    verifyCode: AuthResolver.verifyCode,
    upsertArticleRating: ArticleResolver.articleRating,
    upsertArticleBookmark: ArticleResolver.articleBookmark,
    upsertUserSetting: UserSettingResolver.upsert,
    upsertCampaign: CampaignResolver.upsert,
    uploadArticleImg:ArticleResolver.articleImageUpload
  },
};

module.exports = root;
