/*
  * Created By : Ankita Solace
  * Created Date : 10-12-2019
  * Purpose : Declare all the root mutations
*/

// const _ = require('lodash');
const { GraphQLObjectType } = require('graphql');

const { AddArticle, DeleteArticle,UpdateArticle,SavedFeaturedImage,PublishedArticle, UpdateTags,ApprovedArticle,RejectdArticle } = require('../root_mutation/articles'),
      { AddArticleCategory, DeleteArticleCategory,UpdateArticleCategory } = require('../root_mutation/categories'),
      { AddRole, DeleteRole,UpdateRole } = require('../root_mutation/roles'),
      { AddNotification } = require('../root_mutation/notification'),
      { AddUser, DeleteUser,UpdateUser,UserSignUp } = require('../root_mutation/users'),
      { PlusClapCount, AticleUpVote,AticleDownVote } = require('../root_mutation/article_rating'),
      { AddBookmark,RemoveBookmark } = require('../root_mutation/bookmarks'),
      { ReportThisArticle } = require('../root_mutation/report_article'),
      { BlockAuthors } = require('../root_mutation/block_author'),
      { FollowUnFollowObject } = require('../root_mutation/follow_author'),
      { AddUserCategory } = require('../root_mutation/user_categories'),
      { UpdateUserSettings } = require('../root_mutation/user_settings'),
      { PayDonation,ApprovedDonationAmount } = require('../root_mutation/donation_transaction'),
      { SetUsersSubscription } = require('../root_mutation/users_paid_subscriptions');



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
        createCategories : AddArticleCategory,//add article categories
        deleteCategories : DeleteArticleCategory,// soft delete article categories
        updateCategories : UpdateArticleCategory,// updated only enter values of fields
        addUsers : AddUser, //add users
        deleteUser : DeleteUser,// soft delete users
        updateUser : UpdateUser, // updated only enter values of fields
        addRoles : AddRole, //add roles
        deleteRole : DeleteRole,// soft delete Roles
        updateRole : UpdateRole, // updated only enter values of fields
        signUp : UserSignUp, // user signup functionality
        addNotification : AddNotification, //add notification
        increaseClapCount : PlusClapCount, // add clap count
        upVote : AticleUpVote, // article up vote
        downVote : AticleDownVote, // article down vote
        addBookmarks :AddBookmark, // add article book mark
        RemoveBookmark : RemoveBookmark, // remove article book from book mark page
        reportThisArticle : ReportThisArticle, // report article with block author
        blockAuthor : BlockAuthors, // only block author
        followAuthors : FollowUnFollowObject ,// follow/ unfollow Author
        setUserCategories : AddUserCategory,// insert users categories into database
        savedFeaturedImage : SavedFeaturedImage, // only save fetured image in article schema
        publishedArticle : PublishedArticle, // publish saved articles
        updateUserSettings : UpdateUserSettings,
        PayDonation : PayDonation,
        ApprovedDonationAmount : ApprovedDonationAmount,
        setUsersSubscription : SetUsersSubscription

    }
});

// export mutation constants
module.exports= Mutation;
