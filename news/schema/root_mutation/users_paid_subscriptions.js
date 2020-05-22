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
      Notifications = require('../../models/notifications'),
      { UserPaidSubscriptionType } = require('../types/users_paid_subscriptions'),
      {  GraphQLEmail } = require('graphql-custom-types'),
      {  GraphQLDate } = require('graphql-iso-date'),
      { AmountType,DonationStatusConst } = require('../constant'),
      uniqid = require('uniqid'),
      sendSubscriptionMailToUser = require("../mail/user_subscription"),
      await = require('await');


  // set users subscription to author
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
          sendNotoficationTouser( args );
          UsersPaidSubscriptionLogs.create( args ).then((r) =>{return r;});
          return await UsersPaidSubscriptions.create( args );
      }
  };


// send notification to user and author
  async function  sendNotoficationTouser( args ) {
    let NotificationConstant = new Notifications({
          SenderID :args.AuthorID,
          RecieverID :args.UserID,
          Purpose: "Authors "+args.Purpose,
          NotifyMessage: "you are successfully subscribe to this "+args.SubscriptionTitle+" plan ",
          Subject: "Your plan is start from now for "+args.Days+" days. You have paid "+args.Amount+" "+args.Currency,
          CreatedBy: args.UserID,
          ModifiedBy: args.UserID
    });
    NotificationConstant.save();

    let NotificationConstant2 = new Notifications({
          SenderID :args.UserID,
          RecieverID :args.AuthorID,
          Purpose: "New user subscribed",
          NotifyMessage: "New user subscribe to this plan "+args.SubscriptionTitle,
          Subject: "The plan is for "+args.Days+" days and amount paid "+args.Amount+" "+args.Currency,
          CreatedBy: args.AuthorID,
          ModifiedBy: args.AuthorID
    });
    NotificationConstant2.save();
  }

  // update Author total amount
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

  // calculate subscription date from days
  async function  calculateSubscriptionDates( args ) {
    var TodaysDate = new Date();
        args.StartDate = new Date();
        TodaysDate.setDate(TodaysDate.getDate() + args.Days);
        args.EndDate = TodaysDate;
        args.TXNID = uniqid();
        args.AmountType = AmountType.Credit;
      return args;
  }

  // create user wallet entry
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
  }


  module.exports = { SetUsersSubscription };
