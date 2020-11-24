/*
  * Created By : Yashco Systems
  * Purpose : all root queries
*/

const { GraphQLObjectType } = require('graphql');

const { GetPages  } = require('../root_queries/page_queries'),

// declared root query constant
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

          /* ------------------------------------Customers Pages------------------------------ */
                  GetPages : GetPages,
    }
  });



  // export root quries constant
  module.exports= RootQuery;
