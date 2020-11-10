/*
  * Created By : Ankita Solace
  * Created Date : 29-11-2019
  * Purpose : Declare all article category schema methods
*/


const PageData = require('../../models/pages'),
      { PageType } = require('../types/page_constant'),
      { GraphQLID,GraphQLList , GraphQLInt }= require('graphql'),
      { verifyToken } = require('../middleware/middleware');

// get all pages
const PageAll = {
  type: new GraphQLList(PageType),
  resolve:  () => {
    return pages }
};

module.exports = { PageAll };


