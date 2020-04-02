/*
  * Created By : Ankita Solace
  * Created Date : 13-02-2020
  * Purpose : Declare transaction detials
*/

const Users = require('../../models/users'),
      UsersWalletBalance = require('../../models/user_wallet_balance'),
      { UserType } = require('../types/constant'),
      { UsersWalletBalanceType } = require('../types/user_wallet_balance'),
      { GraphQLID,GraphQLInt,GraphQLList , GraphQLString, GraphQLBoolean } = require('graphql'),
      {  GraphQLEmail } = require('graphql-custom-types'),
      await = require('await'),
      { DonationStatusConst } = require('../constant'),
      async = require("async"),
      DonationTranscations = require('../../models/donation_transaction');


      const GetUsersBalanceDetails = {
           type : new GraphQLList(UsersWalletBalanceType),
           args : { UserID :  { type: GraphQLInt } },
           async resolve(parent, args) {

              return new Promise(async (fullfill, reject) => {
                  let query = { UserID : args.UserID, Status : DonationStatusConst.Active },
                      Data = await UsersWalletBalance.find(query).lean();

                  async.eachSeries(Data, async (data, callback) => {
                      let RefralVal = await DonationTranscations.findOne({TXNID : data.RefrenceID, Status : DonationStatusConst.Approved},{ _id:false, UserID : true,Purpose : true, ArticleTitle : true, ArticleID : true });
                      data.RefrenceDetails = RefralVal;
                  }, async (err) => {
                      if (err) reject(err);  fullfill(Data);
                  });
              });
           }
      };


  


module.exports = { GetUsersBalanceDetails };
