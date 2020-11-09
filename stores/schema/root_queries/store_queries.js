/*
  * Created By : Ankita Solace
  * Created Date : 29-11-2019
  * Purpose : Declare all article category schema methods
*/


const StoreData = require('../../src/models/stores'),
      { StoreType } = require('../types/store_constant'),
      { GraphQLID,GraphQLList , GraphQLInt }= require('graphql'),
      { verifyToken } = require('../middleware/middleware');

// get all stores
const StoreAll = {
  type: new GraphQLList(StoreType),
  resolve:  () => {
    return stores }
};

module.exports = { StoreAll };


