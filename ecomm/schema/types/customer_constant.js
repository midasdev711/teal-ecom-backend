
const { GraphQLObjectType, GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql');
const { GraphQLEmail, GraphQLPassword } = require('graphql-custom-types');
const {  GraphQLDate } = require('graphql-iso-date');


// declared the article category common constant
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        _id: {type: GraphQLString},
        ID: { type: GraphQLInt },
        BasicDetails: { type: GraphQLInputObjectType },
        AddressDetails: { type: GraphQLInputObjectType },
        Tax: { type: GraphQLString },
        Notes : { type: GraphQLEmail },
        Tags :{type: GraphQLString },
    })
});

  // export all the constants
  const CustomerArray = { CustomerType };
  module.exports = CustomerArray;
