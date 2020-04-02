/*
  * Created By : Ankita Solace
  * Created Date : 10-12-2019
  * Purpose : Declare all the root queries
*/
// import  GraphQLJSONObject from 'graphql-type-json';
const { GraphQLObjectType } = require('graphql'),
      { Article, ArticlesAll,ArticleBySlug,DashboardKeywordSerach,PopularArticleList,TrendingArticleList, GetFeaturedImage,MyArticleList,GetAdminArticleList }  = require('../root_queries/article_queries'),
      { ArticleByID, ArticleCategoryAll,getParentCategories,GetCategoriesByIDs } = require('../root_queries/categories_queries'),
      { GetTotalUserBalance,User, UserAll, LoginObject,SignInObject,FaceBookSignInObject,GoogleSignInObject,GetUserProfile } = require('../root_queries/users_queries'),
      { Role , RoleAll } = require('../root_queries/roles_queries'),
      { getUsersNotifications } = require('../root_queries/notification_qureries'),
      { GetAllBookmarks } = require('../root_queries/bookmarks_queries'),
      { FollowAuthorList } = require('../root_queries/follow_author_queries'),
      { MyCheersList } = require('../root_queries/article_rating_queries'),
      { GetUserSettingsByID } = require('../root_queries/user_settings_queries'),
      { GetUsersBalanceDetails } = require('../root_queries/user_wallet_balance'),
      { GetAllSubscriptionList,GetAuthordPaidSubscriptionList } =  require("../root_queries/subscription_list"),
      { GetUsersSubscriptionDetails,GetAuthorsPaidSubscribersList } =  require("../root_queries/users_paid_subscriptions"),
      { MyDonationtransactionDetails,DonationRecivedTransaction } = require("../root_queries/donation_transaction");


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
        article_category:ArticleByID, // get article cateory by id
        article_categories: ArticleCategoryAll, // get all article cateory where statis 1
        parentCategoriesList : getParentCategories, // all parent categories
        getCategoriesByIDs : GetCategoriesByIDs, // string of ID array
        user: User,// get user by ID
        users: UserAll, // get all users where status is 1
        login: LoginObject, // get user login
        signIn :SignInObject, // normal user sign up
        facebookSignIn :FaceBookSignInObject, // facebook user signIn
        googleSignIn :GoogleSignInObject, // google sign in
        getUserProfileDetails: GetUserProfile,
        role: Role,// get role by ID
        roles: RoleAll, // get all roles where status is 1,
        getUsersNotifications :getUsersNotifications, // get login users notification
        getUsersBookmarks : GetAllBookmarks, // get all boorkmarks of login users
        getFollowedAuthorList : FollowAuthorList, // get all the list of followed author
        getFeaturedImage : GetFeaturedImage, // get featured image
        getMyCheerList : MyCheersList,
        getUserSettingsByID : GetUserSettingsByID, // get users settings by ID
        getTotalUserBalance : GetTotalUserBalance,
        getUsersWalletDetails : GetUsersBalanceDetails,
        myDonationtransactionDetails : MyDonationtransactionDetails,
        donationRecivedTransaction : DonationRecivedTransaction,
        getAllSubscriptionList : GetAllSubscriptionList,
        getUsersSubscriptionDetails : GetUsersSubscriptionDetails,
        getAuthordPaidSubscriptionList : GetAuthordPaidSubscriptionList,
        getAuthorsPaidSubscribersList : GetAuthorsPaidSubscribersList
     }
});

// export root quries constant
module.exports= RootQuery;
