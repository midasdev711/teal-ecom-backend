const blogResolver = require("./blogResolver");
const { GraphQLUpload } = require('graphql-upload');
const root = {
  Upload: GraphQLUpload,
  Query: {
    blogs: blogResolver.index
  },
  Mutation: {
    upsertBlog: blogResolver.upsert
  }
};

module.exports = root;
