const express = require("express"),
  { ApolloServer } = require("apollo-server-express");
const { authenticateRequest } = require("../controllers/authController");
const { mergeSchemas } = require("graphql-tools");
const EcommSchema = require('../config/schema');
const NewsSchema = require('../../../news/src/config/schema');


const schema = mergeSchemas({
  schemas: [EcommSchema, NewsSchema],
});

module.exports = function (app) {
  const server = new ApolloServer({
    schema,
    playground: true,
    context: async ({ req }) => {
      // get user object from here for the resolvers.
      let userAuthenticate = await authenticateRequest(req);
      return userAuthenticate;
    }
  });

  app.get("/", async function (req, res, next) {
    console.log("Api is up");
  });


  app.use("/uploads", express.static("uploads"));
  server.applyMiddleware({ app, bodyParserConfig: { limit: 524288000, parameterLimit: 10000000000000, extended: true }, });
};
