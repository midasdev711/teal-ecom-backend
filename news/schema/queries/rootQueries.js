/*
  * Created By : Ankita Solace
  * Created Date : 29-11-2019
  * Purpose : Declare all the root queries
*/

const { GraphQLObjectType } = require('graphql'),
      { GetPremiumArticles,GetFreeArticles,Article, ArticlesAll, GetParserArticleList, ArticleBySlug, ArticleByID, DashboardKeywordSerach, PopularArticleList, TrendingArticleList, GetFeaturedImage,MyArticleList,GetAdminArticleList }  = require('../root_queries/articles'),
      { GetCategoryByType,ArticleByCategoryID,ArticleCategoryAll,GetParentCategories,GetCategoriesByIDs } = require('../root_queries/categories'),
      { GetAuthorProfileDetails,GetTotalUserBalance,User,UserAll,GetUserByID,GetUserProfile, SignInObject,FaceBookSignInObject,GoogleSignInObject,IsEmailExist,RewardsProgress,IsResetURLValid,LoginObject } = require('../root_queries/users'),
      { Role , RoleAll } = require('../root_queries/roles'),
      { MyCheersList } = require('../root_queries/article_ratings'),
      { AllSites } = require('../root_queries/sites'),
      { GetAllBookmarks } = require('../root_queries/bookmarks'),
      { getUsersNotifications } = require('../root_queries/notifications'),
      { GetAllSubscriptionList,GetAuthordPaidSubscriptionList } =  require("../root_queries/subscription_list"),
      { GetUserSettingsByID } = require('../root_queries/user_settings'),
      { GetUsersSubscriptionDetails,GetAuthorsPaidSubscribersList } =  require("../root_queries/users_paid_subscriptions"),
      { MyDonationtransactionDetails,DonationRecivedTransaction } = require("../root_queries/donation_transaction"),
      { GetUsersBalanceDetails } = require('../root_queries/user_wallet_balance'),
      { FollowAuthorList } = require('../root_queries/follow_author');

const { CampaignByID, GetAllCampaign, GetCampaignByName  } = require('../root_queries/campaign');


// declared root query constant
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      article: Article, // get article by ID
      articles:ArticlesAll, // get all articles where status is 1
      getArticleBySlug : ArticleBySlug, // get article by slug
      getDashboardKeySearch : DashboardKeywordSerach,//serach title from Keywords params
      getPopularArticleList :PopularArticleList,
      getTrendingArticleLists:TrendingArticleList,// all trending articles
      myArticleList : MyArticleList, // if login user has created Article then it lists
      getAdminArticleList :GetAdminArticleList,
      getAllArticles : GetParserArticleList,
      getArticleByID : ArticleByID,
      getAuthorProfileDetails : GetAuthorProfileDetails,
      // getHotStoriesList : GetHotStoriesList,
      getMyCheerList : MyCheersList, // article ratings i.e clap count list
      getFreeArticles : GetFreeArticles,
      getPremiumArticles : GetPremiumArticles,
      getUsersNotifications :getUsersNotifications, // get login users notification


      getAllSubscriptionList : GetAllSubscriptionList,
      getAuthordPaidSubscriptionList : GetAuthordPaidSubscriptionList,


      getUsersSubscriptionDetails : GetUsersSubscriptionDetails,
      getAuthorsPaidSubscribersList : GetAuthorsPaidSubscribersList,

      RewardsProgress:RewardsProgress,

      isEmailExists : IsEmailExist,

      user: User,// get user by ID
      users: UserAll, // get all users where status is 1
      login: LoginObject, // get user login
      signIn :SignInObject, // normal user sign up
      facebookSignIn :FaceBookSignInObject, // facebook user signIn
      googleSignIn :GoogleSignInObject, // google sign in
      getUserProfileDetails: GetUserProfile,
      getUserByID: GetUserByID,

      role: Role,// get role by ID
      roles: RoleAll, // get all roles where status is 1,

      getUsersBookmarks : GetAllBookmarks, // get all boorkmarks of login users
      getFollowedAuthorList : FollowAuthorList, // get all the list of followed author

      getFeaturedImage : GetFeaturedImage, // get featured image
      getUserSettingsByID : GetUserSettingsByID, // get users settings by ID

      parentCategoriesList : GetParentCategories, // all parent categories
      getCategoriesByIDs : GetCategoriesByIDs, // string of ID array

      article_category:ArticleByCategoryID, // get article cateory by id
      article_categories: ArticleCategoryAll, // get all article cateory where statis 1
      getCategoryByType : GetCategoryByType,

      isResetURLValid : IsResetURLValid,
      getSiteList : AllSites,

      getTotalUserBalance : GetTotalUserBalance,
      getUsersWalletDetails : GetUsersBalanceDetails,
      myDonationtransactionDetails : MyDonationtransactionDetails,
      donationRecivedTransaction : DonationRecivedTransaction,

      getCampaignByID: CampaignByID,
      getAllCampaign: GetAllCampaign,
      getCampaignByName: GetCampaignByName
    }
  });



  // export root quries constant
  module.exports= RootQuery;
