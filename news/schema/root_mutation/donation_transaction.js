/*
  * Created By : Ankita Solace
  * Created Date : 16-12-2019
  * Purpose : Declare all notification schema methods
*/

const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean,GraphQLFloat } = require('graphql'),
      DonationTranscations = require('../../models/donation_transaction'),
      UsersWalletBalance = require('../../models/user_wallet_balance'),
      Notifications = require('../../models/notifications'),
      {  GraphQLDate } = require('graphql-iso-date'),
      { DonationTranscationType } = require('../types/donation_transaction'),
      { AmountType,DonationStatusConst } = require('../constant'),
      uniqid = require('uniqid'),
      Users = require('../../models/users'),
      { verifyToken } = require('../middleware/middleware');

      // PayDonation to author
     const PayDonation = {
        type : DonationTranscationType,
        args : {
            ID:  { type: GraphQLInt },
            UserID :  { type: GraphQLInt },
            Amount : { type : GraphQLFloat },
            ArticleID :  { type: GraphQLInt },
            ArticleTitle :{  type: GraphQLString },
            AuthorID :  { type: GraphQLInt },
            Purpose : {  type: GraphQLString },
            TXNID :  { type: GraphQLInt },
            Currency : {  type: GraphQLString },
            Status :  { type: GraphQLInt },
            CreatedDate: { type: GraphQLDate },
            ModifiedDate: { type: GraphQLDate },
            MinimunAmount : { type : GraphQLFloat },
        },
        resolve: async (parent, args, context) => {
          const id = await verifyToken(context);
          if(id.UserID) args.UserID = id.UserID
          var Message = {};
          if(args.Amount >=  args.MinimunAmount) {
            args.TXNID = uniqid();
            return DonationTranscations.create( args );
          }
          else throw new Error(`Amount should be greater than Minimum donation amount ${parseFloat(args.MinimunAmount)}`)
        }
     };


     // approved donation payment
     const ApprovedDonationAmount = {
        type : DonationTranscationType,
        args : {
          TXNID :  { type: GraphQLString },
          ID:  { type: GraphQLInt },
          Status :  { type: GraphQLInt },
          PaymentStatus : {  type: GraphQLString },
        },
        resolve: async (parent, args, context) => {
          const id = await verifyToken(context);
          if( typeof args.Status == "undefined" ) args.Status = DonationStatusConst.Approved;

          return DonationTranscations.findOneAndUpdate(
                   {$and: [{ TXNID: args.TXNID },{ Status:DonationStatusConst.Active }]},
                   args,
                   { new: true, returnNewDocument: true }
                ).then((result) => {
                  if( result != null ) {
                      updateUserBalance(result,args);
                      saveUserTransaction( result, args.TXNID  );
                      sendNotification( result,args);
                      return result;
                   }
                  else throw new Error(`This donation transaction is already proccesed`)
                });
        }
     };

     async function  sendNotification( dbobject, args ) {

       let NotificationConstant = new Notifications({
             SenderID :dbobject.AuthorID,
             RecieverID :dbobject.UserID,
             Purpose: dbobject.Purpose,
             NotifyMessage: "Donation is successful.",
             Subject: " You have paid "+dbobject.Amount+" "+dbobject.Currency+" to author for this article "+dbobject.ArticleTitle+" .",
             CreatedBy: dbobject.UserID,
             ModifiedBy: dbobject.UserID
       });
       NotificationConstant.save();

       let NotificationConstant2 = new Notifications({
             SenderID :dbobject.UserID,
             RecieverID :dbobject.AuthorID,
             Purpose: dbobject.Purpose,
             NotifyMessage: "You recieved donation",
             Subject: " You  received "+dbobject.Amount+" "+dbobject.Currency+" from user for this article "+dbobject.ArticleTitle+" .",
             CreatedBy: dbobject.AuthorID,
             ModifiedBy: dbobject.AuthorID
       });
       NotificationConstant2.save();
     }

     // update author amount (balance) after approved donation payment
     async function  updateUserBalance( Data, params ) {
        Users.findOne({ID : Data.AuthorID}).then((user_data) =>{
          var TotalAmount = parseFloat(user_data.TotalWalletAmount ) + parseFloat(Data.Amount);
           Users.updateOne(
             {ID : Data.AuthorID },
             {$set : { TotalWalletAmount  : TotalAmount }}).then((t) =>{ return t; });
        });
     }

     // update user wallet
    async function saveUserTransaction(Data, RefTxnID ) {
      var saveObject = {};
          saveObject.UserID = Data.AuthorID;
          saveObject.Amount = Data.Amount;
          saveObject.Currency = Data.Currency;
          saveObject.AmountType = AmountType.Credit;
          saveObject.Purpose = Data.Purpose;
          saveObject.Status = DonationStatusConst.Active;
          saveObject.RefrenceID = RefTxnID;
          UsersWalletBalance.create( saveObject );
    }

  module.exports = { PayDonation, ApprovedDonationAmount };
