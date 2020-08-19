const express = require('express'),
  { ApolloServer } = require('apollo-server-express'),
  rootResolver = require('../graphql/rootResolver'),
  typeDefs = require('./graphqlTypeDefs');

module.exports = function (app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers: rootResolver,
  });

  app.get('/', function (req, res) {
    res.send('API is up!');
  });

  app.use('/uploads', express.static('uploads'));

  server.applyMiddleware({ app });
};
