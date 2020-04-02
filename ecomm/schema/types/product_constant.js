
const ProductCatgory = require('../../models/products');
const { GraphQLObjectType, GraphQLEnumType,GraphQLScalarType, GraphQLInputObjectType,GraphQLFloat,GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql');
const {  GraphQLDate } = require('graphql-iso-date');

const ProductCategoryType = new GraphQLObjectType({
    name: 'ProductParentCategoriesYashco',
    fields: () => ({
      ID : { type: GraphQLInt },
      Name : { type: GraphQLString }
    })
});

const ProductAttributeType = new GraphQLObjectType({
    name: 'ProductAttributesType',
    fields: () => ({
      _id: {type: GraphQLString},
      AttributsName :{type :GraphQLString},
      AttributeValues :{type : new GraphQLList(GraphQLString) },
    })
});

const ProductVariantType = new GraphQLObjectType({
    name: 'ProductVariantsType',
    fields: () => ({
      VariantName :{type :GraphQLString},
      VariantsValues :{type : new GraphQLList(GraphQLString) },
    })
});

// products SubCategories object
const ProductSubcategoryType = new GraphQLObjectType({
  name : "ProductSubcategoriesYashco",
  fields : ({
    ID : { type: GraphQLInt },
    Name : { type: GraphQLString },
    ParentCategoryID : { type: GraphQLInt }
  })
});

const DecimalConvertProductMRP = new GraphQLScalarType({
       name : "convertToDecimalProductMRP",
       resolve(parent){
           return parseFloat(parent.ProductMRP);
       }
 });
 const DecimalConvertProductSalePrice = new GraphQLScalarType({
       name : "convertToDecimalProductSalePrice",
       resolve(parent){
           return parseFloat(parent.ProductSalePrice);
       }
 });

 // product SEO object
 const ProductSEOType = new GraphQLObjectType({
    name : "ProductSEO",
    fields : ({
      Title : { type: GraphQLString },
      Description : { type: GraphQLString },
      CronicalUrl : { type: GraphQLString },
    })
 });


// declared the article category common constant
// const ProductType = new GraphQLObjectType({
//     name: 'Product',
//     fields: () => ({
//         _id: {type: GraphQLString},
//         ProductID: { type: GraphQLString },
//         ProductSKU:{ type: GraphQLString},
//         ProductTitle :{ type: GraphQLString},
//         ProductDescription:{ type: GraphQLString},
//         ProductSlug:{ type : GraphQLString},
//         ProductMRP : { type : DecimalConvertProductMRP },
//         ProductSalePrice : { type : DecimalConvertProductSalePrice },
//         ProductTotalQuantity:{ type: GraphQLInt },
//         ProductFeaturedImage:{type: GraphQLString },
//         ProductThumnailImage :{ type: GraphQLString },
//         ProductImages : { type: new GraphQLList(GraphQLString) },
//         ProductInventory:{type:GraphQLInt},
//         ProductSearchEngineTitle : {type : GraphQLString },
//         ProductSearchEngineDescription : {type : GraphQLString },
//         ProductCategory : { type :  new GraphQLList(ProductCategoryType) },
//         ProductSubcategory : { type :  new GraphQLList(ProductSubcategoryType) },
//         ProductMerchantID :{type: GraphQLInt },
//         ProductMerchantName :{type: GraphQLString },
//         isPublish :{type : GraphQLString},
//         ProductStartDate : { type : GraphQLString, },
//         Status : { type: GraphQLInt } ,
//         CreatedDate : {
//           type : GraphQLDate,
//           resolve: (parent) => new Date(parent.CreatedDate)
//          },
//
//
//     })
// });

const ProductType = new GraphQLObjectType({
    name: 'Products',
    fields: () => ({
      _id: {type: GraphQLString},
      ProductID :  { type: GraphQLInt },
      ProductMerchantID : { type: GraphQLInt },
      ProductMerchantName : {type: GraphQLString },
      ProductSKU : { type: GraphQLString },
      ProductTitle : { type: GraphQLString },
      ProductSlug : { type: GraphQLString },
      ProductDescription : { type : GraphQLString },
      ProductMRP : { type : DecimalConvertProductMRP },
      ProductSalePrice : { type : DecimalConvertProductSalePrice },
      ProductThumnailImage :{ type: GraphQLString },
      ProductFeaturedImage : { type: GraphQLString },
      ProductImages:{ type :  new GraphQLList(GraphQLString) },
      ProductCategory : { type :  new GraphQLList(ProductCategoryType) },
      ProductSubcategory : { type :  new GraphQLList(ProductSubcategoryType) },
      ProductSEO : { type : ProductSEOType },
      AmpSlug : { type: GraphQLString },
      ProductTotalQuantity : { type: GraphQLInt },
      ProductInventory:{type:GraphQLInt},
      ProductTags : { type: new GraphQLList(GraphQLString) },
      ProductStock : { type: GraphQLInt },
      ProductTermsAndConditions : { type: GraphQLString },
      ProductVariants : { type : new GraphQLList(ProductVariantType) },
      ProductAttributes : { type : new GraphQLList(ProductAttributeType) },
      ProductStartDate : {
        type : GraphQLDate,
        resolve: (parent) => new Date(parent.ProductStartDate)
       },
      ProductEndDate : {
        type : GraphQLDate,
        resolve: (parent) => new Date(parent.ProductEndDate)
       },
      isPublish : { type: GraphQLString },
      ProductSearchEngineTitle : { type : GraphQLString },
      ProductSearchEngineDescription : {type : GraphQLString },
      Status : { type: GraphQLInt },
      CreatedBy : { type: GraphQLInt },
      ModifiedBy : { type: GraphQLInt },
      CreatedDate : {
        type : GraphQLDate,
        resolve: (parent) => new Date(parent.CreatedDate)
       },
      ModifiedDate : {
        type : GraphQLDate,
        resolve: (parent) => new Date(parent.ModifiedDate)
       },
    })
});

  // export all the constants
  const ProductArray = { ProductType };
  module.exports = ProductArray;
