const { makeExecutableSchema } = require('apollo-server');
const resolvers = require("../graphql/rootResolver");
const typeDefs = require("./graphqlTypeDefs");

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers,
});