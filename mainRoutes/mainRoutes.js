const EcommSchema = require("../ecomm/src/config/routes");
const NewsSchema = require("../news/src/config/routes");
const { mergeSchemas } = require("graphql-tools");
const schema = mergeSchemas({
  schemas: [EcommSchema, NewsSchema],
});
