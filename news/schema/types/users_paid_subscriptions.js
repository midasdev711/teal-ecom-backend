/*
  * Created By : Ankita Solace
  * Created Date : 19-02-2020
  * Purpose : Declare all user subscription type defination
*/

const { GraphQLObjectType, GraphQLFloat,GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLScalarType,GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql'),
      { GraphQLEmail, GraphQLPassword } = require('graphql-custom-types'),
      {  GraphQLDate } = require('graphql-iso-date'),
      await = require('await');


      // convert Decimal128 for db aritcle minimum amount
      const PaidSubscriptionAmount = new GraphQLScalarType({
            name : "PaidSubscriptionAmount",
            resolve(parent){   return parseFloat(parent.Amount);  }
      });

      // declared the article category common constant
      const UserPaidSubscriptionType = new GraphQLObjectType({
          name: 'UserPaidSubscriptionType',
          fields: () => ({
            UserSubscriptionID: { type: GraphQLInt },
            UserID :{  type: GraphQLInt },
            UserEmail : { type : GraphQLEmail },
            AuthorID :{  type: GraphQLInt },
            SubscriptionID :{  type: GraphQLInt },
            SubscriptionTitle : {  type: GraphQLString },
            Amount : { type : PaidSubscriptionAmount },
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


      module.exports = { UserPaidSubscriptionType };
