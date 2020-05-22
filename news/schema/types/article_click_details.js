/*
  * Created By : Ankita Solace
  * Created Date : 04-03-2020
  * Purpose : Declare article click details
*/

const Categories = require('../../models/categories'),
      Users = require('../../models/users'),
      Articles = require('../../models/articles'),
      { GraphQLObjectType, GraphQLScalarType,GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql'),
      { GraphQLEmail } = require('graphql-custom-types'),
      {  GraphQLDate } = require('graphql-iso-date'),
      { await } = require("await"),
      { GraphQLJSON } = require('graphql-type-json');


// declared the notifications common constant
  const ArticleClickType = new GraphQLObjectType({
      name: 'ArticleClickDetails',
      fields: () => ({
        ID: { type: GraphQLInt },
        UserID : { type: GraphQLInt },
        ArticleID :{ type: GraphQLInt },
        VisitedDate : { type : GraphQLDate },
        Status : { type: GraphQLInt },
        ArticleTitle : { type: GraphQLString },
        Slug : { type: GraphQLString }
      })
  });


  // export all the constants
  module.exports = { ArticleClickType  };
