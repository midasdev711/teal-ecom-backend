
const AdminCatgory = require('../../models/admin');
const { GraphQLObjectType, GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql');
const { GraphQLEmail, GraphQLPassword } = require('graphql-custom-types');
const {  GraphQLDate } = require('graphql-iso-date');


// declared the article category common constant
const AdminType = new GraphQLObjectType({
    name: 'Admins',
    fields: () => ({
        _id: {type: GraphQLString},
        ID: { type: new GraphQLNonNull(GraphQLInt) },
        token: { type: GraphQLString },
        refreshToken: { type: GraphQLString },
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Email : { type: new GraphQLNonNull(GraphQLEmail) },
        Password: { type: GraphQLString },
        isActive : { type: GraphQLBoolean },
        RoleID : { type: GraphQLInt }
    })
});

  // export all the constants
  const AdminArray = { AdminType };
  module.exports = AdminArray;
