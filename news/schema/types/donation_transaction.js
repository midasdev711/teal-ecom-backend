/*
  * Created By : Ankita Solace
  * Created Date : 12-02-2020
  * Purpose : Declare all the constants
*/

// const DonationTranscations = require('../../models/donation_transaction');

const { GraphQLObjectType, GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLScalarType,GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql'),
      {  GraphQLDate } = require('graphql-iso-date'),
      await = require('await'),
      { GraphQLEmail, GraphQLPassword } = require('graphql-custom-types'),
      Users = require('../../models/users');


      // convert Decimal128 for db aritcle minimum amount
      const DonationAmountType = new GraphQLScalarType({
            name : "DonationAmountType",
            resolve(parent){   return parseFloat(parent.Amount);  }
      });

      // declared the article category common constant
      const DonationTranscationType = new GraphQLObjectType({
          name: 'DonationTranscation',
          fields: () => ({
            ID:  { type: GraphQLInt },
            UserID :  { type: GraphQLInt },
            Amount : { type : DonationAmountType },
            ArticleID :  { type: GraphQLInt },
            ArticleTitle :{  type: GraphQLString },
            AuthorID :  { type: GraphQLInt },
            Purpose :{  type: GraphQLString },
            TXNID :  { type: GraphQLString },
            Status :  { type: GraphQLInt },
            CreatedDate: { type: GraphQLDate },
            ModifiedDate: { type: GraphQLDate },
            Message : {  type: GraphQLString },
            Currency : {  type: GraphQLString },
            PaymentStatus: {  type: GraphQLString },
          })
      });


      module.exports = { DonationTranscationType };
