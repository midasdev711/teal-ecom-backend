/*
  * Created By : Ankita Solace
  * Created Date : 20-02-2020
  * Purpose : Declare all subcription list quries
*/

const { GraphQLID,GraphQLInt,GraphQLList , GraphQLString } = require('graphql'),
      SubscriptionLists = require('../../models/subscription_list'),
      UserSettings = require('../../models/user_settings'),
      { SubscriptionListType } = require('../types/subscription_list'),
      { verifyToken } = require('../middleware/middleware');


  // get all subcription list
  const GetAllSubscriptionList = {
    type: new GraphQLList(SubscriptionListType),
    resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    return SubscriptionLists.find({ Status : 1 }); }
  };

// get authors paid subscription list
 const GetAuthordPaidSubscriptionList = {
     type: new GraphQLList(SubscriptionListType),
     args : { AuthorID : { type : GraphQLInt }},
     description : "list of all subcription plan set by Author for end user(it visible to end user)",
     resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
        return UserSettings.findOne({UserID : args.AuthorID},{_id : false,PaidSubscription: true})
               .then((data) => {
                 console.log(data,"datadatadatadatadata");
                  return data.PaidSubscription.filter( ( object) => {
                      if(object.Status == 1) return object;
                   });
               });
     }
 };


  module.exports = { GetAllSubscriptionList,GetAuthordPaidSubscriptionList };
