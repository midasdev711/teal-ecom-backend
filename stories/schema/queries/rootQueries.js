/*
  * Created By : Yashco Systems
  * Purpose : all root queries
*/

const { GraphQLObjectType } = require('graphql');

const { GetBlogs  } = require('../root_queries/blog_queries'),

// declared root query constant
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

          /* ------------------------------------Customers Blogs------------------------------ */
                  GetBlogs : GetBlogs,
    }
  });



  // export root quries constant
  module.exports= RootQuery;
