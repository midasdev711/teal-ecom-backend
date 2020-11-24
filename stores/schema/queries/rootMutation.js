/*
  * Created By : Yashco Systems
  * Purpose : all root mutations
*/

const { GraphQLObjectType } = require('graphql');

const { AddStore } = require('../root_mutation/store_mutations');

// declared a mutation constant
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        /* ------------------------------------Store Mutation-------------------------------- */

             addStore : AddStore,

        
         /*===========================================================================================
         ==============================================================================================*/

    }
});


// export root quries constant
module.exports= Mutation;
