/*
  * Created By : Yashco System
  * Created Date : 03-12-2019
  * Purpose : Created a graphQl schema of quries and mutation
*/
//
const { GraphQLSchema } = require('graphql');
//
const RootQuery = require('./queries/rootQueries');
const Mutation = require('./queries/rootMutation');
//
// // export mutation and quries graphQl schema object
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
