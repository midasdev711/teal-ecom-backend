/*
  * Created By : Ankita Solace
  * Created Date : 19-02-2020
  * Purpose : Declare all user subscription type defination
*/

const { GraphQLObjectType, GraphQLFloat,GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLScalarType,GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql'),
      { GraphQLEmail, GraphQLPassword } = require('graphql-custom-types'),
      {  GraphQLDate } = require('graphql-iso-date'),
      { GraphQLJSON } = require('graphql-type-json'),
      Users = require("../../models/users"),
      await = require('await');


      // convert Decimal128 for db aritcle minimum amount
      const PaidSubscriptionLogAmount = new GraphQLScalarType({
            name : "PaidSubscriptionLogAmount",
            resolve(parent){   return parseFloat(parent.Amount);  }
      });

      // declared the article category common constant
      const UserPaidSubscriptionLogType = new GraphQLObjectType({
          name: 'UserPaidSubscriptionLogType',
          fields: () => ({
            UserSubscriptionLogID: { type: GraphQLInt },
            UserID :{  type: GraphQLInt },
            UserEmail : { type : GraphQLEmail },
            AuthorID :{  type: GraphQLInt },
            Authors : {
              type : GraphQLJSON,
              resolve(parent) {
                  return Users.findOne({ ID:parent.AuthorID });
              }
            },
            SubscriptionID :{  type: GraphQLInt },
            SubscriptionTitle : {  type: GraphQLString },
            Amount : { type : PaidSubscriptionLogAmount },
            AmountType : { type :  GraphQLString },
            Purpose :{  type: GraphQLString },
            TXNID :{  type: GraphQLString },
            Currency : {  type:GraphQLString },
            Status : { type: GraphQLInt },
            StartDate:  { type: GraphQLDate },
            EndDate:  { type: GraphQLDate },
            CreatedDate:  { type: GraphQLDate },
            ModifiedDate:  { type: GraphQLDate },
            Days : { type : GraphQLInt }
          })
      });


      // convert Decimal128 for db aritcle minimum amount
      const PaidSubscriptionLogAmount1 = new GraphQLScalarType({
            name : "PaidSubscriptionLogAmount1",
            resolve(parent){   return parseFloat(parent.Amount);  }
      });

      const AuthorsSubscriberType = new GraphQLObjectType({
         name : "AuthorsSubscriberType",
         fields :  () => ({
           SubscriptionID: { type : GraphQLInt },
           SubscriptionTitle : {  type: GraphQLString },
           Amount : { type : PaidSubscriptionLogAmount1 },
           EndDate:  { type: GraphQLDate },
           AuthorID :{  type: GraphQLInt },
           UserID :{  type: GraphQLInt },
           UserDetails : {
              type : GraphQLJSON ,
              resolve(parent) {
                  return Users.findOne({ID : parent.UserID},{ID:true,Name:true,_id:false});
              }
           }
         })
      });
      module.exports = { UserPaidSubscriptionLogType,AuthorsSubscriberType };
