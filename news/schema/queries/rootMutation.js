/*
  * Created By : Ankita Solace
  * Created Date : 29-11-2019
  * Purpose : Declare all the root mutations
*/

// const _ = require('lodash');
const { GraphQLObjectType } = require('graphql'),
      { AddArticle, DeleteArticle,UpdateArticle,SavedFeaturedImage,PublishedArticle, UpdateTags,ApprovedArticle,RejectdArticle } = require('../root_mutation/articles'),
      { RegenerateCreativeToken,RegenerateToken,UserSignUp,ForgotPassword,ResetPassword,ProfilePictureUpdate,DeleteUser,UpdateUser } = require('../root_mutation/users'),
      { CreatorSignUp } = require('../root_mutation/creators'),
      { AddArticleCategory, DeleteArticleCategory,UpdateArticleCategory  } = require('../root_mutation/categories'),
      { AddBookmark,RemoveBookmark } = require('../root_mutation/bookmarks'),
      { PlusClapCount } = require('../root_mutation/article_rating'),
      { AddNotification } = require('../root_mutation/notifications'),
      { AddRole, DeleteRole,UpdateRole } = require('../root_mutation/roles'),
      { AddSites } = require('../root_mutation/sites'),
      { ReportThisArticle } = require('../root_mutation/report_article'),
      { BlockAuthors } = require('../root_mutation/block_author'),
      { FollowUnFollowObject } = require('../root_mutation/follow_author'),
      { PayDonation,ApprovedDonationAmount } = require('../root_mutation/donation_transaction'),
      { SetUsersSubscription } = require('../root_mutation/users_paid_subscriptions'),
      { UpdateUserSettings } = require('../root_mutation/user_settings'),
      { AddUserCategory } = require('../root_mutation/user_categories'),
      { UploadUIImages } = require('../root_mutation/upload_ui_images');

// declared a mutation constant
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createArticle : AddArticle, //add article
        deleteArticles : DeleteArticle, // soft delete article (use description or status fields to return value in delete case)
        approvedArticles : ApprovedArticle, //article is approved by admin or moderator
        rejectArticles : RejectdArticle, // article rejected by admin or moderator
        updateArticles : UpdateArticle, // updated only enter values of fields(use description or status fields to return value in update case)
        updateTags : UpdateTags, // update the article tags
        savedFeaturedImage : SavedFeaturedImage, // only save fetured image in article schema
        publishedArticle : PublishedArticle, // publish saved articles

        addNotification : AddNotification, //add notification

        PayDonation : PayDonation,
        ApprovedDonationAmount : ApprovedDonationAmount,
        setUsersSubscription : SetUsersSubscription,

        createCategories : AddArticleCategory,//add article categories
        deleteCategories : DeleteArticleCategory,// soft delete article categories
        updateCategories : UpdateArticleCategory,// updated only enter values of fields

        increaseClapCount : PlusClapCount, // add clap count

        addBookmarks :AddBookmark, // add article book mark
        RemoveBookmark : RemoveBookmark, // remove article book from book mark page

        reportThisArticle : ReportThisArticle, // report article with block author

        addRoles : AddRole, //add roles
        deleteRole : DeleteRole,// soft delete Roles
        updateRole : UpdateRole, // updated only enter values of fields

        blockAuthor : BlockAuthors, // only block author

        followAuthors : FollowUnFollowObject ,// follow/ unfollow Author
        addSites : AddSites,
        setUserCategories : AddUserCategory,// insert users categories into database

        creatorSignUp : CreatorSignUp ,
        forgotPassword : ForgotPassword,
        setPassword : ResetPassword,
        uploadProfileImage : ProfilePictureUpdate,

        updateUserSettings : UpdateUserSettings,

        signUp : UserSignUp, // user signup functionality
        deleteUser : DeleteUser,// soft delete users
        updateUser : UpdateUser, // updated only enter values of fields
        uploadFrondendImg : UploadUIImages,
        regenerateToken : RegenerateToken,
        RegenerateCreativeToken : RegenerateCreativeToken



        // reportThisArticle : ReportThisArticle, // report article with block author

    }
});

// export root quries constant
module.exports= Mutation;
