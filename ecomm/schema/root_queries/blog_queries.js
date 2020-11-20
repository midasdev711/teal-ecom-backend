/*
  * Created By : Ankita Solace
  * Created Date : 29-11-2019
  * Purpose : Declare all article category schema methods
*/


const BlogData = require('../../src/models/blogs'),
      { BlogType } = require('../types/blog_constant'),
      { GraphQLID,GraphQLList , GraphQLInt }= require('graphql'),
      { verifyToken } = require('../middleware/middleware');

// get all blogs
const BlogAll = {
  type: new GraphQLList(BlogType),
  resolve:  () => {
    return blogs }
};

module.exports = { BlogAll };


