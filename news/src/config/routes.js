const express = require("express"),
  { ApolloServer } = require("apollo-server-express"),
  rootResolver = require("../graphql/rootResolver"),
  typeDefs = require("./graphqlTypeDefs");

module.exports = function (app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers: rootResolver,
    context: ({ req }) => {
      // get user object from here for the resolvers.
      // const token = req.headers.authorization || '';
      // user = getUser(token);
      // return user;
    },
  });

  app.get("/", function (req, res) {
    // console.log(JSON.stringify(req));
    res.send("API is up!");
  });

  app.use("/uploads", express.static("uploads"));

  server.applyMiddleware({ app });
};
