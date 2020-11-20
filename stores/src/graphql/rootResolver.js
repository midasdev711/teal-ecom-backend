const storeResolver = require("./storeResolver");
const { GraphQLUpload } = require('graphql-upload');
const root = {
  Upload: GraphQLUpload,
  Query: {
    stores: storeResolver.index
  },
  Mutation: {stores
    upsertpage: storeResolver.upsert
  }
};

module.exports = root;
