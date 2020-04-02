/*
  * Created By : Ankita Solace
  * Created Date : 13-02-2020
  * Purpose : Declare transaction detials
*/

const { DonationTranscationType } = require('../types/donation_transaction'),
      { GraphQLID,GraphQLInt,GraphQLList , GraphQLString, GraphQLBoolean } = require('graphql'),
      {  GraphQLEmail } = require('graphql-custom-types'),
      await = require('await'),
      { DonationStatusConst } = require('../constant'),
      async = require("async"),
      DonationTranscations = require('../../models/donation_transaction');



    const MyDonationtransactionDetails = {
        type : new GraphQLList( DonationTranscationType ),
        description : "get login users donation paid details",
        args : { UserID : { type : GraphQLInt } },
        resolve(parent, args) {
            return DonationTranscations.find({ UserID : args.UserID, Status : DonationStatusConst.Approved });
        }
    };


    const DonationRecivedTransaction = {
        type : new GraphQLList( DonationTranscationType ),
        description : "get login users donation received details",
        args : { UserID : { type : GraphQLInt } },
        resolve(parent, args) {
            return DonationTranscations.find({ AuthorID : args.UserID, Status : DonationStatusConst.Approved });
        }
    };



module.exports = { MyDonationtransactionDetails,DonationRecivedTransaction };
