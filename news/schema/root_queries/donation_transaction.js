/*
  * Created By : Ankita Solace
  * Created Date : 13-02-2020
  * Purpose : Declare transaction detials
*/

const { DonationTranscationType } = require('../types/donation_transaction'),
      { GraphQLInt,GraphQLList ,   } = require('graphql'),
      { DonationStatusConst } = require('../constant'),
      DonationTranscations = require('../../models/donation_transaction'),
      { verifyToken } = require('../middleware/middleware');

    // my donation transaction details (login user)
    const MyDonationtransactionDetails = {
        type : new GraphQLList( DonationTranscationType ),
        description : "get login users donation paid details",
        args : { UserID : { type : GraphQLInt } },
        resolve: async (parent, args, context) => {
          const id = await verifyToken(context);
          if(id.UserID) args.UserID = id.UserID
            return DonationTranscations.find({ UserID : args.UserID, Status : DonationStatusConst.Approved });
        }
    };


    // donation recived to login users
    const DonationRecivedTransaction = {
        type : new GraphQLList( DonationTranscationType ),
        description : "get login users donation received details",
        args : { UserID : { type : GraphQLInt } },
        resolve: async (parent, args, context) => {
          const id = await verifyToken(context);
          if(id.UserID) args.UserID = id.UserID
            return DonationTranscations.find({ AuthorID : args.UserID, Status : DonationStatusConst.Approved });
        }
    };



module.exports = { MyDonationtransactionDetails,DonationRecivedTransaction };
