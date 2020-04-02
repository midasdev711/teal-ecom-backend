
const orderCatgory = require('../../models/order');
const VariantDetails   = require("../../models/product_variants");
const ProductDetails   = require ("../../models/products");
const { GraphQLObjectType, GraphQLScalarType,GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql');
const { GraphQLEmail, GraphQLPassword } = require('graphql-custom-types');
const {  GraphQLDate } = require('graphql-iso-date');
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
const { productConstantType } = require('./product_constant');

const { VariantsType } = require("./product_variant_constant");
const  { ProductType } = require("./product_constant");

const DecimalConvertOrderAmount = new GraphQLScalarType({
      name : "convertToDecimalOrderAmountt",
      resolve(parent){
          return parseFloat(parent.OrderAmount);
      }
});


const DecimalConvertItemTotalPrice = new GraphQLScalarType({
    name : "convertToDecimalOrderStatusProductTotalPrice",
    resolve(parent){
        return parseFloat(parent.ProductTotalPrice);
    }
});

const DecimalConvertProductSalePrice = new GraphQLScalarType({
    name : "convertToDecimalOrderStatusProductSalePrice",
    resolve(parent){
        return parseFloat(parent.ProductSalePrice);
    }
});


const OrderStatusProductType = new GraphQLObjectType({
    name: 'OrderStatusProductType',
    fields: () => ({
        _id: {type: GraphQLString},
        Status: { type: GraphQLInt },
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
const OrderStatusType = new GraphQLObjectType({
    name: 'ordersType',
    fields: () => ({
        _id: {type: GraphQLString},
        ID: { type: GraphQLInt },
        Status: { type: GraphQLInt },
        UserID: { type: GraphQLString },
        OrderAmount : { type : DecimalConvertOrderAmount },
        DeliveryAddress: { type: GraphQLJSONObject },
        ShippingAddress : {type: GraphQLJSONObject },
        //Products:{ type: GraphQLJSONObject },
        Products:{ type: OrderStatusProductType },
        PaymentMethod: { type: GraphQLString },
        TokenID: { type: GraphQLString },
        CreatedDate :{type:GraphQLDate},
        ModifiedDate :{type:GraphQLDate}
    })
});

  // export all the constants
  const OrderTypeArray = { OrderStatusType };
  module.exports = OrderTypeArray;
