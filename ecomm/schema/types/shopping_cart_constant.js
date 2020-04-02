
const ShoppingCart = require('../../models/shopping_cart');
const { GraphQLObjectType, GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql');
const {  GraphQLDate } = require('graphql-iso-date');
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');

// declared the article category common constant
const ShoppingCartType = new GraphQLObjectType({
    name: 'ShoppingCart',
    fields: () => ({
        _id: {type: GraphQLString},
        ID: { type: GraphQLInt },
        UserId :{type :GraphQLString },
        OrderId:{type: GraphQLString },
        Status : {type: GraphQLInt}
    })
});

  // export all the constants
  const ShoppingCartArray = { ShoppingCartType };
  module.exports = ShoppingCartArray;
