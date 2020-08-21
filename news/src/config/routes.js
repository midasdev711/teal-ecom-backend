const express = require("express"),
  { ApolloServer } = require("apollo-server-express"),
  rootResolver = require("../graphql/rootResolver"),
  typeDefs = require("./graphqlTypeDefs");
const apiKeys = require("../models/api_key");
const { authenticateRequest } = require("../controllers/authController");

module.exports = function (app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers: rootResolver,
    context: async ({ req }) => {
      // get user object from here for the resolvers.
      // const token = req.headers.authorization || '';
      // user = getUser(token);
      // return user;
      let userAuthenticate = await authenticateRequest(req);
      console.log(userAuthenticate);
      return { userAuthenticate };
    },
  });

  app.get("/", async function (req, res, next) {
    console.log("Api is up");
  });

  app.use("/uploads", express.static("uploads"));
  server.applyMiddleware({ app });
};
