const { GraphQLObjectType, GraphQLScalarType,GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql'),
      { GraphQLEmail } = require('graphql-custom-types'),
      {  GraphQLDate } = require('graphql-iso-date'),
      { await } = require("await"),
      { GraphQLJSON } = require('graphql-type-json');



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

// type defination for privacy field in users settings const
const PrivacyType = new GraphQLObjectType({
 name : "PrivacySettings",
 fields : () => ({
    isSocialStatShow : {type : GraphQLBoolean },
    isCheeredPostShow : {type : GraphQLBoolean }
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

  const ButtonType = new GraphQLObjectType({
      name : 'Button',
      fields : () =>({
         isDaily : {type : GraphQLBoolean },
         isWeekly : {type : GraphQLBoolean },
         isOff : {type : GraphQLBoolean }
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
        isPaidSubscription : { type : GraphQLBoolean },
        ModifiedDate : { type: GraphQLDate },
        Status : { type: GraphQLInt }
    })
});

module.exports = { UserSettingType };
