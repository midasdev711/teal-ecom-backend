/*
  * Created By : Yashco Systems
  * Purpose : all root mutations
*/

const { GraphQLObjectType } = require('graphql');

const { AddBlog } = require('../root_mutation/blog_mutations');

// declared a mutation constant
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        /* ------------------------------------Blog Mutation-------------------------------- */

             addBlog : AddBlog,

        
         /*===========================================================================================
         ==============================================================================================*/

    }
});


// export root quries constant
module.exports= Mutation;
