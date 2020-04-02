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
            const SubAmountType = new GraphQLScalarType({
                  name : "SubAmountType",
                  resolve(parent){   return parseFloat(parent.Amount);  }
            });


      // declared the article category common constant
      const SubscriptionListType = new GraphQLObjectType({
          name: 'SubscriptionListType',
          fields: () => ({
            SubscriptionID: {  type: GraphQLInt },
            Name:  { type: GraphQLString },
            Description: {type: GraphQLString },
            Days: {type: GraphQLInt},
            Status : { type: GraphQLInt, default: 1 },
            CreatedDate:  { type: GraphQLDate },
            ModifiedDate:  { type: GraphQLDate },
            Amount : { type : SubAmountType },
            // CreatedBy: GraphQLInt,
            // ModifiedBy: GraphQLInt
          })
      });


      module.exports = { SubscriptionListType };
