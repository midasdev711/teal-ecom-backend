
const { UserType } = require("./constant"),
      { GraphQLObjectType, GraphQLScalarType,GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql'),
      { GraphQLEmail } = require('graphql-custom-types'),
      {  GraphQLDate } = require('graphql-iso-date'),
      { await } = require("await"),
      { GraphQLJSON } = require('graphql-type-json');


      // sites schema typ4e def
      const AuthPayloadType = new GraphQLObjectType({
          name: 'AuthoriseUsers',
          fields: ( ) => ({
              Users : { type : UserType },
              token : { type : GraphQLString }
          })
      });



module.exports = { AuthPayloadType } ;
