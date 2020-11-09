/*
  * Created By : Yashco Systems
  * Purpose : all root queries
*/

const { GraphQLObjectType } = require('graphql');

const { GetStores  } = require('../root_queries/store_queries'),

// declared root query constant
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

          /* ------------------------------------Customers Stores------------------------------ */
                  GetStores : GetStores,
    }
  });



  // export root quries constant
  module.exports= RootQuery;
