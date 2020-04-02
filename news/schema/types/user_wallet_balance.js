/*
  * Created By : Ankita Solace
  * Created Date : 12-02-2020
  * Purpose : Declare all the constants
*/

// const UsersWalletBalance = require('../../models/user_wallet_balance');

const { GraphQLObjectType, GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLScalarType,GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql'),
      { GraphQLEmail, GraphQLPassword } = require('graphql-custom-types'),
      {  GraphQLDate } = require('graphql-iso-date'),
      await = require('await');



      const UserTransDetailsType = new GraphQLObjectType({
          name : 'UserTransDetailsType',
          fields : () => ({
              UserID : { type: GraphQLInt },
              ArticleID : { type: GraphQLInt },
              Purpose : {  type: GraphQLString },
              ArticleTitle : {  type: GraphQLString }
          })
      });

      // convert Decimal128 for db aritcle minimum amount
      const UserWalletAmountType = new GraphQLScalarType({
            name : "UserWalletAmountType",
            resolve(parent){   return parseFloat(parent.Amount);  }
      });

      // declared the article category common constant
      const UsersWalletBalanceType = new GraphQLObjectType({
          name: 'UsersWalletBalanceType',
          fields: () => ({
            ID: { type: GraphQLInt },
            UserID : { type: GraphQLInt },
            Amount : { type : UserWalletAmountType },
            AmountType : {  type: GraphQLString },
            Purpose : {  type: GraphQLString },
            RefrenceID : { type: GraphQLString },
            Status : { type: GraphQLInt },
            CreatedDate:  { type: GraphQLDate },
            ModifiedDate:  { type: GraphQLDate },
            Currency : {  type: GraphQLString },
            RefrenceDetails : { type : UserTransDetailsType }
          })
      });


      module.exports = { UsersWalletBalanceType };
