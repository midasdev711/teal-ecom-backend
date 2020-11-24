const pageResolver = require("./pageResolver");
const { GraphQLUpload } = require('graphql-upload');
const root = {
  Upload: GraphQLUpload,
  Query: {
    pages: pageResolver.index
  },
  Mutation: {pages
    upsertpage: pageResolver.upsert
  }
};

module.exports = root;
