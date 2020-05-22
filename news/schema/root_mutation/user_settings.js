/*
  * Created By : Ankita Solace
  * Created Date : 19-11-2019
  * Purpose : Declare all user settings schema methods
*/

const { GraphQLInt,GraphQLID,GraphQLList ,GraphQLFloat, GraphQLString,GraphQLBoolean,GraphQLInputObjectType } = require('graphql'),
      UserSettings = require('../../models/user_settings'),
      Articles = require('../../models/articles'),
      Users = require('../../models/users'),
      {  UserType } = require('../types/constant'),
      { UserSettingType } = require("../types/user_settings"),
      {  GraphQLEmail } = require('graphql-custom-types'),
      await = require('await');

// input object of arguments to userSettings
const AccountInputType = new GraphQLInputObjectType({
    name: 'AccountInput',
    fields: () => ({
      Name: {   type: GraphQLString },
      Email: {   type: GraphQLString },
      UserName :  {   type: GraphQLString },
      isFacebook :  {type : GraphQLBoolean }
    })
});

// input object for Privacy
const PrivacyInputType = new GraphQLInputObjectType({
    name: 'PrivacyInput',
    fields: () => ({
      isSocialStatShow : {type : GraphQLBoolean },
      isCheeredPostShow : {type : GraphQLBoolean },
    })
});

// input type to set button type
const ButtonType = new GraphQLInputObjectType({
    name: 'CommonButton',
    fields: () => ({
      isDaily : { type : GraphQLBoolean },
      isWeekly : { type : GraphQLBoolean },
      isOff : { type: GraphQLBoolean },
    })
});

// trending input object
const TrendingInputType = new GraphQLInputObjectType({
    name: 'TrendingInput',
    fields: () => ({
      isEmail : { type : GraphQLBoolean },
      isPush : { type : GraphQLBoolean },
      Button : { type: ButtonType },
    })
});

// social activity input object
const SocialActivityInputType = new GraphQLInputObjectType({
    name: 'SocialActivityInput',
    fields: () => ({
      isEmail : { type : GraphQLBoolean },
      isPush : { type : GraphQLBoolean },
    })
});

// page follow input object
const PagesFollowInputType = new GraphQLInputObjectType({
    name: 'PagesFollowInput',
    fields: () => ({
      isEmail : { type : GraphQLBoolean },
      isPush : { type : GraphQLBoolean },
    })
});

// author follow input object
const AuthorsFollowInputType = new GraphQLInputObjectType({
    name: 'AuthorsFollowInput',
    fields: () => ({
      isEmail : { type : GraphQLBoolean },
      isPush : { type : GraphQLBoolean },
    })
});

const PagesLikeInputType = new GraphQLInputObjectType({
    name: 'PagesLikeInput',
    fields: () => ({
      isEmail : { type : GraphQLBoolean },
      isPush : { type : GraphQLBoolean },
      Button : { type: ButtonType },
    })
});

// author like input object
const AuthorsLikeInputType = new GraphQLInputObjectType({
    name: 'AuthorsLikeInput',
    fields: () => ({
      isEmail : { type : GraphQLBoolean },
      isPush : { type : GraphQLBoolean },
      Button : { type: ButtonType },
    })
});

// Recommanded input object
const RecommandedInputType = new GraphQLInputObjectType({
    name: 'RecommandedInput',
    fields: () => ({
      isEmail : { type : GraphQLBoolean },
      isPush : { type : GraphQLBoolean },
      Button : { type: ButtonType },
    })
});

// notification input object
  const NotificationInputType =  new GraphQLInputObjectType({
      name : "NotificationInput",
      fields: () =>({
          Trending :{ type: TrendingInputType },
          Recommanded : { type: RecommandedInputType },
          AuthorsLike: { type: AuthorsLikeInputType },
          PagesLike: { type: PagesLikeInputType },
          AuthorsFollow: { type: AuthorsFollowInputType },
          PagesFollow: { type: PagesFollowInputType },
          SocialActivity: { type: SocialActivityInputType },
      })
  });

// paid subscription input object
  const PaidSubscriptionInputType = new GraphQLInputObjectType({
      name: 'PaidSubscriptionInputSettings',
      fields: () => ({
          SubscriptionID : { type : GraphQLInt },
          Name : { type : GraphQLString },
          Amount : { type : GraphQLFloat },
          Description : { type : GraphQLString },
          Days : { type : GraphQLInt },
          Status : { type : GraphQLInt }
      })
  });

// update data in user table
async function updateUserData( args,UserID ) {
  var data = {};

  if( typeof args.PaidSubscription != 'undefined' ) {
    data.isPaidSubscription = args.isPaidSubscription;
    data.PaidSubscription = args.PaidSubscription;
  } else data = args;

    await Users.findOneAndUpdate(
            { ID : UserID },
            data,
            { upsert: true, returnNewDocument: true }
         )
}

  // if user i.e author set subscrition then it will update in all articles
  // async function  updateAllArticlesSubscription( AuthorID ) {
  //       Articles.updateMany({ AuthorID : AuthorID },
  //         { $set : { isPaidSubscription : true } },{ upsert: true,new: true, returnNewDocument: true }).then((t) =>{console.log(t);});
  // }

  // update user settings
  const UpdateUserSettings = {
      type : UserSettingType,
      args: {
        UserID : { type: GraphQLInt },
        Account : { type: AccountInputType },
        Privacy : { type : PrivacyInputType },
        Notification : { type : NotificationInputType },
        isPaidSubscription : { type : GraphQLBoolean },
        PaidSubscription : {type : new GraphQLList(PaidSubscriptionInputType) }
      },
      async resolve(parent, args) {
        return await UserSettings.findOne({$and: [{  UserID: args.UserID },{ Status : 1 }]})
        .then(async (SettingData) => {
            let FinalData =  {};

              if( typeof args.isPaidSubscription != 'undefined' ){
                  updateUserData( args,args.UserID );
                  FinalData.isPaidSubscription = args.isPaidSubscription;
                  FinalData.PaidSubscription = args.PaidSubscription;
                  // if( args.isPaidSubscription ) updateAllArticlesSubscription( args.UserID );
              }

              if( typeof args.Account != "undefined" ) {
                FinalData.Account =  await getAccountData(SettingData.Account,args.Account);
                updateUserData( args.Account,args.UserID );
              }

              if( typeof args.Notification != "undefined" )
                FinalData.Notification =  await getNotificationData(SettingData.Notification,args.Notification);

              if( typeof args.Privacy != "undefined" )
                  FinalData.Privacy =  await getPrivacyData(SettingData.Privacy,args.Privacy);

              return UserSettings.findOneAndUpdate(
                {$and: [{  UserID: args.UserID },{ Status : 1 }]},
                FinalData,
                {  upsert:true, new: true,returnNewDocument: true }
              );
        });
      }
  };

  // check value is exists in args if not then replace value
  async function checkExistsOrNot( dbVal, ArgsVal) {
    var ReturnFeild = dbVal;
      if( ArgsVal != "undefined")  ReturnFeild = ArgsVal;
      return ReturnFeild;
  }

  // get account realted data collect through args and db value
  async function getAccountData(AllData, ArgsData) {
     let AccountData = {};
     if( typeof ArgsData.Name != "undefined" )
          AccountData.Name = await checkExistsOrNot(AllData.Name,ArgsData.Name);
     else  AccountData.Name = AllData.Name;
     if( typeof ArgsData.Email != "undefined" )
          AccountData.Email = await checkExistsOrNot(AllData.Email,ArgsData.Email);
     else  AccountData.Email = AllData.Email;
     if( typeof ArgsData.isFacebook != "undefined" )
          AccountData.isFacebook = await checkExistsOrNot(AllData.isFacebook,ArgsData.isFacebook);
     else  AccountData.isFacebook = AllData.isFacebook;

     return AccountData;
  }

  // get notification related args and db data
  async function getNotificationData( AllData, ArgsData ) {
    let NotificationData = {};
    if( typeof ArgsData.Trending != "undefined" )
        NotificationData.Trending = await NotificationWithButton(AllData.Trending, ArgsData.Trending);
    else  NotificationData.Trending = AllData.Trending;

    if( typeof ArgsData.Recommanded != "undefined" )
        NotificationData.Recommanded = await NotificationWithButton(AllData.Recommanded, ArgsData.Recommanded);
    else  NotificationData.Recommanded = AllData.Recommanded;

    if( typeof ArgsData.AuthorsLike != "undefined" )
        NotificationData.AuthorsLike = await NotificationWithButton(AllData.AuthorsLike, ArgsData.AuthorsLike);
    else  NotificationData.AuthorsLike = AllData.AuthorsLike;

    if( typeof ArgsData.PagesLike != "undefined" )
        NotificationData.PagesLike = await NotificationWithButton(AllData.PagesLike, ArgsData.PagesLike);
    else  NotificationData.PagesLike = AllData.PagesLike;

    if( typeof ArgsData.AuthorsFollow != "undefined" )
        NotificationData.AuthorsFollow = await NotificationWithoutButton(AllData.AuthorsFollow, ArgsData.AuthorsFollow);
    else  NotificationData.AuthorsFollow = AllData.AuthorsFollow;

    if( typeof ArgsData.PagesFollow != "undefined" )
        NotificationData.PagesFollow = await NotificationWithoutButton(AllData.PagesFollow, ArgsData.PagesFollow);
    else  NotificationData.PagesFollow = AllData.PagesFollow;

    if( typeof ArgsData.SocialActivity != "undefined" )
        NotificationData.SocialActivity = await NotificationWithoutButton(AllData.SocialActivity, ArgsData.SocialActivity);
    else  NotificationData.SocialActivity = AllData.SocialActivity;

    // console.log("NotificationData",NotificationData);
    return NotificationData;
  }

  // notification data with button related values
  async function NotificationWithButton( AllData, ArgsData ) {
    let setData = {};
    if( typeof ArgsData.isEmail != "undefined" )
        setData.isEmail = await checkExistsOrNot(AllData.isEmail,ArgsData.isEmail);
    else setData.isEmail = AllData.isEmail;
    if( typeof ArgsData.isPush != "undefined" )
        setData.isPush = await checkExistsOrNot(AllData.isPush,ArgsData.isPush);
    else setData.isPush = AllData.isPush;

    if(typeof  ArgsData.Button != "undefined" )
        setData.Button = await  getButtonData(AllData, ArgsData);
    else setData.Button = AllData.Button;
    return setData;
  }

  // get button data
  async function getButtonData( AllData, ArgsData ) {
    let setButtonData = {};
      if( typeof ArgsData.Button.isDaily != "undefined" ) setButtonData.isDaily = await checkExistsOrNot(AllData.Button.isDaily,ArgsData.Button.isDaily);
      else setButtonData.isDaily = AllData.Button.isDaily;

      if( typeof ArgsData.Button.isWeekly != "undefined" ) setButtonData.isWeekly = await checkExistsOrNot(AllData.Button.isWeekly,ArgsData.Button.isWeekly);
      else setButtonData.isWeekly = AllData.Button.isWeekly;

      if( typeof ArgsData.Button.isOff != "undefined" ) setButtonData.isOff = await checkExistsOrNot(AllData.Button.isOff,ArgsData.Button.isOff);
      else setButtonData.isOff = AllData.Button.isOff;
      return setButtonData;
  }

  // get notification data without button related value
  async function NotificationWithoutButton( AllData, ArgsData ) {
      let setData = {};
      if( typeof ArgsData.isEmail != "undefined" )
          setData.isEmail = await checkExistsOrNot(AllData.isEmail,ArgsData.isEmail);
      else setData.isEmail = AllData.isEmail;
      if( typeof ArgsData.isPush != "undefined" )
          setData.isPush = await checkExistsOrNot(AllData.isPush,ArgsData.isPush);
      else setData.isPush = AllData.isPush;
      return setData;
  }

  // get account provicy data if not found in edit case set values form db for same id
  async function getPrivacyData( AllData, ArgsData ) {
      let ReturnPrivacyData = {};
      if( typeof ArgsData.isSocialStatShow != "undefined" )
           ReturnPrivacyData.isSocialStatShow = await checkExistsOrNot(AllData.isSocialStatShow,ArgsData.isSocialStatShow);
      else  ReturnPrivacyData.isSocialStatShow = AllData.isSocialStatShow;
      if( typeof ArgsData.isCheeredPostShow != "undefined" )
           ReturnPrivacyData.isCheeredPostShow = await checkExistsOrNot(AllData.isCheeredPostShow,ArgsData.isCheeredPostShow);
      else  ReturnPrivacyData.isCheeredPostShow = AllData.isCheeredPostShow;

      return ReturnPrivacyData;
  }


module.exports = { UpdateUserSettings };
