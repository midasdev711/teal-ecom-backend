
const ShoppingCartDetails = require('../../models/shopping_cart_detail');
const VariantDetails   = require("../../models/product_variants");
const ProductDetails   = require ("../../models/products");
const { GraphQLObjectType, GraphQLScalarType,GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql');
const {  GraphQLDate } = require('graphql-iso-date');
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');

const { VariantsType } = require("./product_variant_constant");
const  { ProductType } = require("./product_constant");

const DecimalConvertItemTotalPrice = new GraphQLScalarType({
    name : "convertToDecimalProductTotalPricee",
    resolve(parent){
        return parseFloat(parent.ProductTotalPrice);
    }
});

const DecimalConvertProductSalePrice = new GraphQLScalarType({
    name : "convertToDecimalProductSalePricee",
    resolve(parent){
        return parseFloat(parent.ProductSalePrice);
    }
});


const CartProductType = new GraphQLObjectType({
    name: 'CartProductType',
    fields: () => ({
        _id: {type: GraphQLString},
        ProductID:{type :GraphQLString},
        ProductMerchantID:{type :GraphQLInt},
        ProductSKU:{type :GraphQLString},
        ProductTitle:{type :GraphQLString},
        ProductSalePrice:{type :DecimalConvertProductSalePrice },
        ProductTotalQuantity:{type :GraphQLInt},
        ProductTotalPrice:{type :DecimalConvertItemTotalPrice },
        ProductVariantID:{type :GraphQLString},
        ProductVariantObject : {
        type : VariantsType,
        resolve : async (parent, args) => {
            let variationDetails = await VariantDetails.find({ _id : parent.ProductVariantID, Status : 1 });
            let variationData ;
            if(variationDetails.length > 0)
             {
                variationData = variationDetails[0]
             }
            return variationData
         }
      },
      ProductObject : {
        type : ProductType,
        resolve : async (parent, args) => {
            let productDetails = await ProductDetails.find({ ProductID : parent.ProductID, Status : 1 });
            let productData ;
            if(productDetails.length > 0)
             {
                productData = productDetails[0];
             }
            return productData
         }
      },
    })
});

// declared the article category common constant
const ShoppingCartDetailsType = new GraphQLObjectType({
    name: 'ShoppingCartDetails',
    fields: () => ({
        _id: {type: GraphQLString},
        ID: { type: GraphQLInt },
        ShoppingCartId :{type :GraphQLString },
        ItemTotalPrice:{ type : DecimalConvertItemTotalPrice },
        TotalCartItem:{type: GraphQLInt },
        Status : {type: GraphQLInt},
        reviewDetails : {type: GraphQLString },
        Products:{type:  new GraphQLList(CartProductType) }
    })
});


// declared the article category common constant
// const ShoppingCartDetailsType = new GraphQLObjectType({
//     name: 'ShoppingCartDetails',
//     fields: () => ({
//         _id: {type: GraphQLString},
//         ID: { type: GraphQLInt },
//         ShoppingCartId :{type :GraphQLString },
//         ItemTotalPrice:{ type : DecimalConvertItemTotalPrice },
//         TotalCartItem:{type: GraphQLInt },
//         Status : {type: GraphQLInt},
//         reviewDetails : {type: GraphQLString },
//         Products:{type: new GraphQLList(GraphQLJSON) }
//     })
// });

  // export all the constants
  const ShoppingCartDetailsArray = { ShoppingCartDetailsType };
  module.exports = ShoppingCartDetailsArray;
