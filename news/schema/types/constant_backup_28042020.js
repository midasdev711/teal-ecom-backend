/*
  * Created By : Ankita Solace
  * Created Date : 29-11-2019
  * Purpose : Declare all the constants
*/

const Categories = require('../../models/categories'),
      Users = require('../../models/users'),
      Articles = require('../../models/articles'),
      { GraphQLObjectType, GraphQLScalarType,GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql'),
      { GraphQLEmail } = require('graphql-custom-types'),
      {  GraphQLDate } = require('graphql-iso-date'),
      { await } = require("await"),
      { ArticleType } = require("./articles"),
      { GraphQLJSON } = require('graphql-type-json');

// sites schema typ4e def
const SiteType = new GraphQLObjectType({
    name: 'Sites',
    fields: ( ) => ({
        ID: { type: GraphQLInt },
        AuthorID: { type: new GraphQLNonNull(GraphQLInt) },
        SiteUrl: { type: GraphQLString },
        Status : { type: GraphQLInt }
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
          Article : {
            type: GraphQLJSON,
            resolve(parent, args) {
                return Articles.findOne({ ID: parent.ArticleID });
            }
          }
      })
  });

// parent category sub object type def for usertype
const ParentCategoryType = new GraphQLObjectType({
    name : "UsersParentCategory",
    fields: () => ({
      ID: { type: GraphQLInt },
      Name: { type: GraphQLString }
    })
});

// sub category sub object type def for usertype
const SubcategoriesType = new GraphQLObjectType({
    name : "UsersSubCategories",
    fields: () => ({
      ID: { type: GraphQLInt },
      Name: { type: GraphQLString },
      ParentCategoryID: { type: GraphQLInt },
    })
});

// display the count
const TableInfo = new GraphQLObjectType({
  name: 'TableInfo',
  fields :() => ({
    count: { type: GraphQLInt }
  })
});


// display message for password
const PasswordInfo = new GraphQLObjectType({
  name: 'PasswordInfo',
  fields :() => ({
    Message: { type: GraphQLString }
  })
});


// display profile image as return cvlue
const ProfileImageInfo = new GraphQLObjectType({
  name: 'ProfileImageInfo',
  fields :() => ({
    Avatar: { type: GraphQLString }
  })
});

// declared the users common constant
const EmailLogType = new GraphQLObjectType({
    name: 'EmailLogs',
    fields: () => ({
      ID: { type: GraphQLInt },
      Email : { type:GraphQLEmail },
      Subject: { type: GraphQLString },
      UniqueLinkKey: { type: GraphQLString },
      Description: { type: GraphQLString },
      From  : { type: GraphQLString },
      StartDate :  { type : GraphQLDate },
      EndDate:  { type : GraphQLDate },
      Status : { type: GraphQLInt },
      CreatedDate :  { type : GraphQLDate },
      ModifiedDate :  { type : GraphQLDate },
      CreatedBy: { type: GraphQLInt },
      ModifiedBy: { type: GraphQLInt },
    })
});

// ttoal amount decimal in user typedef
const TotalWalletAmountType = new GraphQLScalarType({
    name : "TotalWalletAmountType",
    resolve(parent){
        return parseFloat(parent.TotalWalletAmount);
    }
});

//paid subcription type def decimal amount
const SubscriptionAmountType = new GraphQLScalarType({
    name : "SubscriptionAmountType",
    resolve(parent){
        return parseFloat(parent.Amount);
    }
});

// paid subcription type def
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

const ActivityLogType = new GraphQLObjectType({
    name: 'ActivityLogUsers',
    fields: () => ({
        LatestArticles : { type : new GraphQLList(GraphQLJSON) },
        ClapedArticles : { type : new GraphQLList(GraphQLJSON) },
        RecentlyVisited : { type : new GraphQLList(GraphQLJSON) },
        BookmarkedArticles : { type : new GraphQLList(GraphQLJSON) },
    })
});

// declared the users common constant
const UserType = new GraphQLObjectType({
    name: 'Users',
    fields: () => ({
        ID: { type: GraphQLInt },
        token: { type: GraphQLString },
        refreshToken: { type: GraphQLString },
        CreativeToken: { type: GraphQLString },
        Name: { type: GraphQLString },
        UserName : { type : GraphQLString },
        Email : { type:GraphQLEmail },
        Description: { type: GraphQLString },
        Status: { type: GraphQLInt },
        Password: { type: GraphQLString },
        RoleID : { type: GraphQLInt },
        Avatar: { type: GraphQLString },
        isVerified : { type: GraphQLBoolean },
        SignUpMethod: {
          type: GraphQLString ,
           description : 'enum fileds with value allowed : ["Site","Facebook", "Google", "Mobile"]'},
        FaceBookUrl : { type: GraphQLString},
        UserCounter  : { type: GraphQLInt },
        TotalWalletAmount : { type: TotalWalletAmountType },
        isPaidSubscription : { type : GraphQLBoolean },
        PaidSubscription : { type : new GraphQLList( PaidSubscriptionType ) },
        Following : { type : GraphQLInt },
        Follower : { type : GraphQLInt },
        ParentCategories : { type : new GraphQLList( ParentCategoryType ) },
        SubCategories : { type : new GraphQLList( SubcategoriesType ) },
        CreatedDate :  { type : GraphQLDate },
        ModifiedDate :  { type : GraphQLDate },
        MobileNo : { type: GraphQLString },
        Dob : { type : GraphQLDate },
        Gender : { type : GraphQLString,
          description : 'enum fileds with value allowed : ["Male","Female", "Other"]'
         },
        UniqueID : { type : GraphQLString },
        ReferenceID : { type : GraphQLString },
        FreeArticles : { type : new GraphQLList(GraphQLJSON) },
        PremiumArticles : { type : new GraphQLList(GraphQLJSON) },
        ActivityLog : { type : ActivityLogType },
        IpAddress : { type : GraphQLString },
        isFollowing :{
          type : GraphQLBoolean,
          description : "used for authors profiles details"
        },
        isSubscriptionAllowed :{
          type : GraphQLBoolean,
          description : "used for authors profiles details"
        }
    })
});

// declared the Creators common constant
const CreatorType = new GraphQLObjectType({
    name: 'Creators',
    fields: () => ({
        ID: { type: GraphQLInt },
        Name: { type: GraphQLString },
        Email : { type:GraphQLEmail },
        Description: { type: GraphQLString },
        Status: { type: GraphQLInt },
        CreatedDate :  { type : GraphQLDate },
        ModifiedDate :  { type : GraphQLDate },
        MobileNo : { type: GraphQLString },
        UniqueID : { type : GraphQLString },
    })
});

// declared the category common constant
const CategoryType = new GraphQLObjectType({
    name: 'Categories',
    fields: () => ({
        ID: { type: GraphQLInt },
        Name: { type: GraphQLString },
        Description: { type: GraphQLString },
        Status: { type: GraphQLInt },
        Slug: { type: GraphQLString },
        isParent: { type: GraphQLBoolean },
      	FeatureImage : { type: GraphQLString },
        ParentCategoryID : { type : GraphQLInt },
        CreatedDate :  { type : GraphQLDate },
        ModifiedDate :  { type : GraphQLDate },
      	Sequence : { type : GraphQLInt },
        SubCategories : {
          type: new GraphQLList(CategoryType),
          resolve(parent, args){
              return Categories.find({ ParentCategoryID : parent.ID });
          }
        }
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

const ArticleBookmarkType = new GraphQLObjectType({
      name: 'ArticleBookmarks',
      fields: ( ) => ({
          ID: { type: GraphQLInt },
          ArticleID: { type: GraphQLInt },
          UserID: { type: new GraphQLNonNull(GraphQLInt) },
          Status : { type: GraphQLInt },
          Article: {
              type: new GraphQLList( ArticleType ),
            async  resolve(parent, args) {
                  return await Articles.find({ ID: parent.ArticleID }).then(async (mark) =>{
                    if(mark.length > 0  ) {
                      if( parent.Status == 1 ) mark[0].isBookmark = true;
                      else mark[0].isBookmark = false;
                    }


                    console.log(mark,"mark");
                    return await mark;
                  });

              }
          }
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
module.exports = { UserCategoryType,NotificationType,SiteType,ProfileImageInfo,EmailLogType,PasswordInfo, TableInfo,FollowAuthorType,BlockAuthorType,ReportArticleType,RoleType, CategoryType, UserType,CreatorType,ArticleBookmarkType,ArticleRatingType };
