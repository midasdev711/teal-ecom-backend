
const VariantsCatgory = require('../../models/product_variants');
const { GraphQLObjectType, GraphQLScalarType,GraphQLJSON,GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql');
const {  GraphQLDate } = require('graphql-iso-date');



const DecimalConvertCostPrice = new GraphQLScalarType({
       name : "convertToDecimalCostPrice",
       resolve(parent){
           return parseFloat(parent.CostPrice);
       }
 });
 const DecimalConvertSellingPrice = new GraphQLScalarType({
       name : "convertToDecimalSalePrice",
       resolve(parent){
           return parseFloat(parent.SellingPrice);
       }
 });

 // variant object
 const VariantsAttribute = new GraphQLObjectType({
  name : "VariantInputt",
  fields: () => ({
      _id: {type: GraphQLString},
     Name : { type: GraphQLString },
     Value : {type: GraphQLString }
  })
 });

// declared the article category common constant
const VariantsType = new GraphQLObjectType({
    name: 'Variants',
    fields: () => ({
        _id: {type: GraphQLString},
        ID: { type: GraphQLInt },
        ProductID : { type: GraphQLString },
        MerchantID : { type: GraphQLString },
        CostPrice  : { type : DecimalConvertCostPrice},
        SellingPrice  : { type : DecimalConvertSellingPrice },
        VariantStock  : { type: GraphQLString },
        VariantSKU : { type: GraphQLString  },
        VariantImage : { type: GraphQLString },
        Status : {  type: GraphQLInt },
        ProductVariants  : {type: new GraphQLList(VariantsAttribute) }
    })
});



  // export all the constants
  const VariantsArray = { VariantsType };
  module.exports = VariantsArray;
