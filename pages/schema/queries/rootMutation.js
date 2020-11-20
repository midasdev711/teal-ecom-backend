/*
  * Created By : Yashco Systems
  * Purpose : all root mutations
*/

const { GraphQLObjectType } = require('graphql');

const { AddPage } = require('../root_mutation/page_mutations');

// declared a mutation constant
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        /* ------------------------------------Page Mutation-------------------------------- */

             addPage : AddPage,

        
         /*===========================================================================================
         ==============================================================================================*/

    }
});


// export root quries constant
module.exports= Mutation;
