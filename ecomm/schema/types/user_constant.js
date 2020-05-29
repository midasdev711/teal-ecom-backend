
const users = require('../../../news/models/users');
const { GraphQLObjectType, GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql');
const { GraphQLEmail } = require('graphql-custom-types');


// declared the users common constant
const UserType = new GraphQLObjectType({
    name: 'users',
    fields: () => ({
        _id: {type: GraphQLString },
        ID: { type: GraphQLInt },
        RoleID: { type: GraphQLInt },
        token: { type: GraphQLString },
        refreshToken: { type: GraphQLString },
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Email : { type: new GraphQLNonNull(GraphQLEmail) },
        Description: { type: GraphQLString },
        Status: { type: GraphQLInt },
        Password: { type: GraphQLString },
        isVerified : { type: GraphQLBoolean },
        SignUpMethod: { type: GraphQLString }

    })
});

  // export all the constants
  const SchemaArray = { UserType };
  module.exports = SchemaArray;