
const MerchantCatgory = require('../../models/attributes');
const { GraphQLObjectType, GraphQLJSON,GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql');
const {  GraphQLDate } = require('graphql-iso-date');


// declared the article category common constant
const AttributesType = new GraphQLObjectType({
    name: 'Attributes',
    fields: () => ({
        _id: {type: GraphQLString},
        ID: { type: GraphQLInt },
        MerchantId: { type: GraphQLInt },
        AttributsName: { type: GraphQLString }, 
        AttributeValues:{type: new GraphQLList(GraphQLString) },
        ProductType: { type: GraphQLString }
    })
});

  // export all the constants
  const AttributesArray = { AttributesType };
  module.exports = AttributesArray;
