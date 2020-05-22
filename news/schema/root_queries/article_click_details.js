/*
  * Created By : Ankita Solace
  * Created Date : 11-12-2019
  * Purpose : Declare all article queries
*/


const Articles = require('../../models/articles'),
      { ArticleType } = require('../types/articles'),
      { ArticleStatusConst, RoleObject,PremiumContentLen ,SubscribeCdnUrl } = require('../constant'),
      { GraphQLID,GraphQLList , GraphQLString,GraphQLInt }= require('graphql'),
      await = require('await'),
      async = require("async");






// module.exports = {};
