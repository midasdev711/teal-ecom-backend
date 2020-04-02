/*
  * Created By : Ankita Solace
  * Created Date : 10-12-2019
  * Purpose : Declare all the constants
*/

const Categories = require('../../models/categories'),
      Articles = require('../../models/article'),
      Users = require('../../models/users'),
      Roles = require('../../models/roles'),
      Notifications = require('../../models/notification'),
      ArticleRatings = require('../../models/article_rating'),
      ArticleBookmarks = require('../../models/bookmarks'),
      ReportArticle = require('../../models/report_article'),
      BlockAuthor = require('../../models/block_author'),
      FollowAuthor = require('../../models/follow_author'),
      UserCategory = require('../../models/users_categories'),
      UserSettings = require('../../models/user_settings');

const { GraphQLFloat, GraphQLObjectType, GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLScalarType,GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql'),
      { GraphQLEmail, GraphQLPassword } = require('graphql-custom-types'),
      {  GraphQLDate } = require('graphql-iso-date'),
      await = require('await');


    const UserSettingAmountType = new GraphQLScalarType({
          name : "UserSettingAmountType",
          resolve(parent){   return parseFloat(parent.Amount);  }
    });

  const UserSettingPaidSubscriptionType = new GraphQLObjectType({
      name: 'UserSettingPaidSubscriptionType',
      fields: () => ({
          SubscriptionID : { type : GraphQLInt },
          Name : { type : GraphQLString },
          Amount : { type :  UserSettingAmountType },
          Description : { type : GraphQLString },
          Days  : { type : GraphQLInt },
          Status : { type : GraphQLInt }
      })
  });

// declared the article category common constant
const UserSettingType = new GraphQLObjectType({
    name: 'UserSettings',
    fields: () => ({
        ID: { type: GraphQLInt },
        UserID: { type: GraphQLInt },
        Account: { type: AccountSettingType },
        Notification : { type: UserNotificationType },
        Privacy : { type : PrivacyType },
        PaidSubscription : { type : new GraphQLList(UserSettingPaidSubscriptionType) },
        // isPaidSubscription : {},
        isPaidSubscription : { type : GraphQLBoolean },

        ModifiedDate : { type: GraphQLDate },
        Status : { type: GraphQLInt }
    })
});

  // account settings type defination for account fields in user settings
  const AccountSettingType = new GraphQLObjectType({
        name : "AccountSettings",
        fields : () => ({
          Name: { type: GraphQLString },
          Email : { type:GraphQLEmail },
          UserName : { type:GraphQLString },
          isFacebook :  { type:GraphQLBoolean }
        })
  });

  // user notification type defination for notification field in users settings
  const UserNotificationType = new GraphQLObjectType({
        name : "NotificationSettings",
        fields : () => ({
          Trending: { type: RadioButtonType },
          Recommanded : { type:RadioButtonType },
          AuthorsLike : { type:RadioButtonType },
          PagesLike :  { type:RadioButtonType },
          AuthorsFollow :  { type:EmailPushSettingType },
          PagesFollow :  { type:EmailPushSettingType },
          SocialActivity :  { type:EmailPushSettingType }
        })
  });

  // radio button and updates buttons for user notfication feilds in constant
  const RadioButtonType = new GraphQLObjectType({
      name : 'RadioButton',
      fields : () =>({
        isEmail : {type : GraphQLBoolean },
        isPush :  {type : GraphQLBoolean },
        Button : { type : ButtonType }
      })
  });

  const ButtonType = new GraphQLObjectType({
      name : 'Button',
      fields : () =>({
         isDaily : {type : GraphQLBoolean },
         isWeekly : {type : GraphQLBoolean },
         isOff : {type : GraphQLBoolean }
      })
  });

// email & push boolean type defination for user notification fileds in constant
  const EmailPushSettingType = new GraphQLObjectType({
      name : 'EmailPush',
      fields : () =>({
        isEmail : {type : GraphQLBoolean },
        isPush :  {type : GraphQLBoolean }
      })
  });

// type defination for privacy field in users settings const
const PrivacyType = new GraphQLObjectType({
   name : "PrivacySettings",
   fields : () => ({
      isSocialStatShow : {type : GraphQLBoolean },
      isCheeredPostShow : {type : GraphQLBoolean }
   })
});

// type defination for is show boolean in privacy type constant
const ShowType =  new GraphQLObjectType({
    name : "IsShow",
    fields : () => ({
        isShow : {type : GraphQLBoolean }
    })
});


  const TotalWalletAmountType = new GraphQLScalarType({
      name : "TotalWalletAmountType",
      resolve(parent){
          return parseFloat(parent.TotalWalletAmount);
      }
  });

  const SubscriptionAmountType = new GraphQLScalarType({
      name : "SubscriptionAmountType",
      resolve(parent){
          return parseFloat(parent.Amount);
      }
  });

  const PaidSubscriptionType = new GraphQLObjectType({
      name : 'PaidSubscriptionType',
      fields : () => ({
        SubscriptionID : { type : GraphQLInt },
        Name : { type : GraphQLString },
        Amount : { type : SubscriptionAmountType },
        Description : { type : GraphQLString },
        Days : { type : GraphQLInt },
        Status : { type : GraphQLInt }
      })
  });

// declared the users common constant
const UserType = new GraphQLObjectType({
    name: 'Users',
    fields: () => ({
        ID: { type: GraphQLInt },
        Name: { type: GraphQLString },
        Email : { type:GraphQLEmail },
        Description: { type: GraphQLString },
        Status: { type: GraphQLInt },
        Password: { type: GraphQLString },
        RoleID : { type: GraphQLInt },
        // isSignup : { type: GraphQLBoolean },
        // isLogin : { type: GraphQLBoolean },
        Avatar: { type: GraphQLString },
        isVerified : { type: GraphQLBoolean },
        SignUpMethod: { type: GraphQLString },
        FaceBookUrl : { type: GraphQLString},
        UserCounter  : { type: GraphQLInt },
        TotalWalletAmount : { type: TotalWalletAmountType },
        isPaidSubscription : { type : GraphQLBoolean },
        PaidSubscription : { type : new GraphQLList( PaidSubscriptionType ) },
        Following :{
          type: GraphQLInt,
          resolve(parent, args){
              return FollowAuthor.find({ UserID : parent.ID }).countDocuments();
          }
        },
        Follower :{
          type: GraphQLInt,
          resolve(parent, args){
            return FollowAuthor.find({ AuthorID : parent.ID }).countDocuments();
          }
        },
        // MyStories : {
        //   // type : new GraphQLList(ArticleType),
        //   // async resolve(parent, args) {
        //   //   console.log(parent.ID);
        //   //   return await Articles.find({ AuthorID : parent.ID, Status:1 });
        //   // }
        // },
        Mycheers :{
          type: new GraphQLList(ArticleType),
             resolve(parent, args) {
               return   ArticleRatings.distinct("ArticleID",{UserID : parent.ID, Status : 1 }).then( (get) =>{
                 return   Articles.find({ ID : { $in : get }, Status:1 });
               });
            }
        },
        // MyBookmarks : {
        //   type: new GraphQLList(ArticleType),
        //   async resolve(parent, args) {
        //      return  await ArticleBookmarks.distinct("ArticleID",{UserID : parent.ID, Status : 1 }).then(async (get) =>{
        //        return  await Articles.find({ ID : { $in : get }, Status:1 });
        //      });
        //   }
        // },
    })
});


      // account settings type defination for account fields in user settings
      const DefSubCategory = new GraphQLObjectType({
            name : "SubArticleCategories",
            fields : () => ({
              ID: { type: GraphQLInt },
              Name : { type:GraphQLString }
            })
      });

    const DefCategoryType = new GraphQLObjectType({
          name : "ParentArticleCategories",
          fields : () => ({
            ID: { type: GraphQLInt },
            Name : { type:GraphQLString },
            SubCategories: { type : new GraphQLList(DefSubCategory) }
          })
    });


    // convert Decimal128 for db aritcle minimum amount
    const MinimumDonationAmountType = new GraphQLScalarType({
          name : "MinimumDonationAmountType",
          resolve(parent){
              return parseFloat(parent.MinimumDonationAmount);
          }
    });

  // declared the article common constant
  const ArticleType = new GraphQLObjectType({
      name: 'Articles',
      fields: () => ({
          ID: { type: GraphQLInt },
          Title: { type: new GraphQLNonNull(GraphQLString) },
          SubTitle: { type: GraphQLString },
          Description: { type: GraphQLString },
          Slug: { type: new GraphQLNonNull(GraphQLString) },
          Sequence: { type: GraphQLID },
          CreatedDate :{type:GraphQLDate},
          AuthorID :{ type: GraphQLInt },
          Authors :{
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return Users.find({ ID: parent.AuthorID });
            }
          },
          isPublish : { type : GraphQLBoolean},
          AmpSlug:{ type: GraphQLString },
          FeatureImage:{ type: GraphQLString },
          Thumbnail:{ type: GraphQLString },
          ReadMinutes:{ type: GraphQLString },
          ViewCount:{ type: GraphQLInt },
          Tags:{ type:new GraphQLList(GraphQLString) },
          Status: { type: GraphQLID },
          TotalClapCount : { type: GraphQLInt },
          // TotalUpVote : { type: GraphQLInt },
          // TotalDownVote : { type: GraphQLInt },
          Categories : {type : DefCategoryType },
          TotalArticleCount : {
            type: GraphQLInt,
            resolve(parent, args){
                return Articles.find( { Status :  1 } ).countDocuments();
            }
          },
          AcceptDonation : { type : GraphQLBoolean},
          MinimumDonationAmount : { type : MinimumDonationAmountType },
          isBookmark : { type : GraphQLBoolean},
          isFollowed : { type : GraphQLBoolean},
          isPaidSubscription : { type : GraphQLBoolean },
          isContentAllowed : { type : GraphQLBoolean },
      }),
  });

  // declared the article category common constant
  const CategoryType = new GraphQLObjectType({
      name: 'Categories',
      fields: () => ({
          ID: { type: new GraphQLNonNull(GraphQLInt) },
          Name: { type: new GraphQLNonNull(GraphQLString) },
          Description: { type: GraphQLString },
          Slug: { type: new GraphQLNonNull(GraphQLString) },
          Sequence: { type: GraphQLInt },
          Status: { type: GraphQLInt },
          FeatureImage : { type: GraphQLString },
          isParent : { type: GraphQLBoolean },
          ParentCategoryID : { type: GraphQLInt },
          SubCategories : {
            type: new GraphQLList(CategoryType),
            resolve(parent, args){
                return Categories.find({ ParentCategoryID : parent.ID });
            }
          }
      })
  });

  // declared the users common constant
  const RoleType = new GraphQLObjectType({
      name: 'Roles',
      fields: () => ({
          ID: { type: GraphQLInt },
          Name: { type: GraphQLString },
          Description: { type: GraphQLString },
          Status: { type: GraphQLInt }
      })
  });

  // declared the notifications common constant
  const NotificationType = new GraphQLObjectType({
      name: 'Notifications',
      fields: () => ({
          ID: { type: new GraphQLNonNull(GraphQLInt) },
          SenderID :{ type: GraphQLInt },
          RecieverID :{ type: GraphQLInt },
          Subject : { type: GraphQLString },
          Purpose : { type: GraphQLString },
          NotifyMessage : { type: GraphQLString },
          isView : { type: GraphQLBoolean },
          Sender : {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return Users.find({ ID: parent.SenderID });
            }
          },
          Reciever : {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return Users.find({ ID: parent.RecieverID });
            }
          }
      })
  });

  // declared the notifications common constant
  const ArticleRatingType = new GraphQLObjectType({
      name: 'ArticleRatings',
      fields: () => ({
          ID: { type: GraphQLInt },
          Description :{ type: GraphQLString },
          UserID : { type:GraphQLInt },
          ClapCount :{ type: GraphQLInt },
          UpVote  : { type: GraphQLString },
          DownVote : { type: GraphQLString },
          ArticleID : { type: GraphQLInt },
          Status : { type: GraphQLString },
          Articles : {
            type: new GraphQLList(ArticleType),
            resolve(parent, args) {
                return Articles.find({ ID: parent.ArticleID });
            }
          }
      })
  });

    // declared the article bookmark type def common constant
  const ArticleBookmarkType = new GraphQLObjectType({
      name: 'ArticleBookmarks',
      fields: ( ) => ({
          ID: { type: GraphQLInt },
          ArticleID: { type: GraphQLInt },
          UserID: { type: new GraphQLNonNull(GraphQLInt) },
          Status : { type: GraphQLInt },
          Article: {
              type: new GraphQLList(ArticleType),
              resolve(parent, args) {
                  return Articles.find({ ID: parent.ArticleID });
              }
          }
      })
  });

  // declared the article report type def common constant
  const ReportArticleType = new GraphQLObjectType({
      name: 'ReportArticle',
      fields: ( ) => ({
          ID: { type: GraphQLInt },
          ArticleID: { type: new GraphQLNonNull(GraphQLInt) },
          UserID: { type: new GraphQLNonNull(GraphQLInt) },
          AuthorID: { type: new GraphQLNonNull(GraphQLInt) },
          ReasonType: { type: GraphQLString },
          Status : { type: GraphQLBoolean },
          isAuthorBlocked: { type: GraphQLBoolean }
      })
  });

// declared the block author type def common constant
  const BlockAuthorType = new GraphQLObjectType({
      name: 'BlockAuthor',
      fields: ( ) => ({
          ID: { type: GraphQLInt },
          UserID: { type: new GraphQLNonNull(GraphQLInt) },
          AuthorID: { type: new GraphQLNonNull(GraphQLInt) },
          Status : { type: GraphQLBoolean },
          isAuthorBlocked: { type: GraphQLBoolean }
      })
  });

  // declared the follow author type def common constant
  const FollowAuthorType = new GraphQLObjectType({
    name: 'FollowAuthor',
    fields: ( ) => ({
        ID: { type: GraphQLInt },
        UserID: { type: new GraphQLNonNull(GraphQLInt) },
        AuthorID: { type: new GraphQLNonNull(GraphQLInt) },
        isFollowed : { type: GraphQLBoolean },
        Status : { type: GraphQLInt },
        ModifiedDate : {type: GraphQLDate }
    })
});

// declared the users selected type def common constant
const UserCategoryType = new GraphQLObjectType({
    name: 'UserCategory',
    fields: ( ) => ({
        ID: { type: GraphQLInt },
        CategoryID: { type: new GraphQLNonNull(GraphQLInt) },
        UserID: { type: new GraphQLNonNull(GraphQLInt) },
        Status : { type: GraphQLBoolean },
        ModifiedDate : {type: GraphQLDate }
    })
});

  // export all the constants
  const SchemaArray = { CategoryType, ArticleType,UserType,RoleType,NotificationType,ArticleRatingType,ArticleBookmarkType,ReportArticleType, BlockAuthorType,FollowAuthorType, UserCategoryType,UserSettingType };
  module.exports = SchemaArray;
