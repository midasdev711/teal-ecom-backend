/*
  * Created By : Ankita Solace
  * Created Date : 20-02-2020
  * Purpose : Declare all users paid subcriptions quries
*/

const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString } = require('graphql'),
      UserPaidSubscriptionLogs = require('../../models/users_paid_subscription_logs'),
      { UserPaidSubscriptionLogType,AuthorsSubscriberType } = require('../types/users_paid_subscription_logs');


   // get the list of all users subscrition
  const GetUsersSubscriptionDetails = {
    type: new GraphQLList(UserPaidSubscriptionLogType),
    description  : "get the list of all users subscrition",
    args : { UserID : { type : GraphQLInt } },
    resolve(parent, args) { return UserPaidSubscriptionLogs.find({ Status : 1,UserID: args.UserID }); }
  };

// get authors pais subscriber list log
  const GetAuthorsPaidSubscribersList = {
      type : new GraphQLList( AuthorsSubscriberType ),
      args : { AuthorID : {type :GraphQLInt }},
      resolve( parent, args) {
        return UserPaidSubscriptionLogs.find({AuthorID : args.AuthorID})
      }
  };

  module.exports = { GetUsersSubscriptionDetails,GetAuthorsPaidSubscribersList };
