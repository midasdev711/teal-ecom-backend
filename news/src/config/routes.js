const express = require("express"),
  expressPlayground = require("graphql-playground-middleware-express").default,
  graphTools = require("graphql-tools"),
  get = require("lodash/get"),
  HttpStatus = require("http-status-codes"),
  rootResolver = require("../graphql/rootResolver"),
  typeDefs = require("./graphqlTypeDefs"),
  graphqlHTTP = require("express-graphql"),
  { verifyToken } = require("../controllers/authController");

module.exports = function (app) {
  app.get("/", function (req, res) {
    res.send("API is up!");
  });

  app.use("/uploads", express.static("uploads"));
  app.get("/playground", expressPlayground({ endpoint: "/ecomm" }));

  // bind express with graphql
  app.use(
    "/graphql",
    graphqlHTTP((req, res) => {
      return {
        schema: graphTools.makeExecutableSchema({
          typeDefs: typeDefs,
          resolvers: rootResolver,
        }),
        graphiql: true,
        formatError: (err) => ({
          message: get(err, "originalError.message") || err.message,
          code:
            get(err, "originalError.code") || HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      };
    })
  );
};
