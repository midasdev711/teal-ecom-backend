/*
  * Created By : Ankita Solace
  * Created Date : 19-02-2020
  * Purpose : Declare all user subscription
*/

const { GraphQLInt,GraphQLID,GraphQLList ,GraphQLFloat, GraphQLString,GraphQLBoolean,GraphQLInputObjectType } = require('graphql'),
      Users = require('../../models/users'),
      UsersPaidSubscriptions = require('../../models/users_paid_subscriptions'),
      UsersWalletBalance = require('../../models/user_wallet_balance'),
      UsersPaidSubscriptionLogs = require('../../models/users_paid_subscription_logs'),
      { UserPaidSubscriptionType } = require('../types/users_paid_subscriptions'),
      {  GraphQLEmail } = require('graphql-custom-types'),
      {  GraphQLDate } = require('graphql-iso-date'),
      { AmountType,DonationStatusConst } = require('../constant'),
      uniqid = require('uniqid'),
      sendSubscriptionMailToUser = require("../mail/user_subscription"),
      await = require('await');



  const SetUsersSubscription = {
      type : UserPaidSubscriptionType,
      description : "this api create users subscription",
      args : {
        UserSubscriptionID: { type: GraphQLInt },
        UserID :{  type: GraphQLInt }, //login
        UserEmail : { type : GraphQLEmail }, // useremail
        AuthorID :{  type: GraphQLInt },// subscriberid
        SubscriptionID :{  type: GraphQLInt }, // selectedid
        SubscriptionTitle : {  type: GraphQLString }, // selected subscription monthly,wekly
        Amount : { type : GraphQLFloat }, // subscrition amt
        Purpose : {  type: GraphQLString } , // subscrition
        Currency : {  type:GraphQLString },// user currency
        Days : {type : GraphQLInt },
        ModifiedDate:  { type: GraphQLDate }
      },
      async resolve( parent, args ) {
        sendSubscriptionMailToUser( args );
          args = await  calculateSubscriptionDates( args );
          addToUserWallet( args );
          updateUserBalance( args );
          UsersPaidSubscriptionLogs.create( args ).then((r) =>{return r;});
          // if(typeof args.UserSubscriptionID != undefined && args.UserSubscriptionID != 0 ) {
          //     // UserSubscriptionID
          //     // return findOneAndUpdate(
          //     //   { UserSubscriptionID : args.UserSubscriptionID },
          //     //    args,
          //     //   {new : true, upsert : true}
          //     // );
          //   return  UsersPaidSubscriptions.findOneAndUpdate(
          //        { UserSubscriptionID : args.UserSubscriptionID },
          //        args,
          //       {new : true, upsert : true}
          //     );
          // } else
           return await UsersPaidSubscriptions.create( args );

      }
  };

  async function  updateUserBalance( Data ) {
     Users.findOne( { ID : Data.AuthorID } )
          .then((user_data) =>{
            // console.log(user_data,"user_datauser_datauser_datauser_data");
              var TotalAmount = parseFloat(user_data.TotalWalletAmount ) + parseFloat(Data.Amount);
              Users.updateOne(
                      {ID : Data.AuthorID },
                      {$set : { TotalWalletAmount  : TotalAmount }},
                      { new : true, upsert : true })
                   .then((t) =>{ return t; });
        });
  }

  async function  calculateSubscriptionDates( args ) {
    var TodaysDate = new Date();
        args.StartDate = new Date();
        TodaysDate.setDate(TodaysDate.getDate() + args.Days);
        args.EndDate = TodaysDate;
        args.TXNID = uniqid();
        args.AmountType = AmountType.Credit;
      return args;
  }

  async function  addToUserWallet( args ) {

    var saveObject = {};
        saveObject.UserID = args.AuthorID;
        saveObject.Amount = args.Amount;
        saveObject.Currency = args.Currency;
        saveObject.AmountType = AmountType.Credit;
        saveObject.Purpose = args.Purpose;
        saveObject.Status = DonationStatusConst.Active;
        saveObject.RefrenceID = args.TXNID;
        UsersWalletBalance.create( saveObject );

        // TotalBalanceAmount
  }


  module.exports = { SetUsersSubscription };
