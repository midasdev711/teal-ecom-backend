/*
  * Created By : Ankita Solace
  * Created Date : 20-02-2020
  * Purpose : Declare all users paid subcriptions quries
*/

const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString } = require('graphql'),
      UserPaidSubscriptionLogs = require('../../models/users_paid_subscription_logs'),
      { UserPaidSubscriptionLogType,AuthorsSubscriberType } = require('../types/users_paid_subscription_logs'),
      { verifyToken } = require('../middleware/middleware');

   // get the list of all users subscrition
  const GetUsersSubscriptionDetails = {
    type: new GraphQLList(UserPaidSubscriptionLogType),
    description  : "get the list of all users subscrition",
    args : { UserID : { type : GraphQLInt } },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      if( id.UserID ) args.UserID = id.UserID
       return UserPaidSubscriptionLogs.find({ Status : 1,UserID: args.UserID });
      }
  };

// get authors pais subscriber list log
  const GetAuthorsPaidSubscribersList = {
      type : new GraphQLList( AuthorsSubscriberType ),
      args : { AuthorID : {type :GraphQLInt }},
      resolve: async (parent, args, context) => {
        const id = await verifyToken(context);
        return UserPaidSubscriptionLogs.find({AuthorID : args.AuthorID})
      }
  };

  module.exports = { GetUsersSubscriptionDetails,GetAuthorsPaidSubscribersList };
