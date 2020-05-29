
const Variants = require('../../models/product_variants');
const { VariantsType } = require('../types/product_variant_constant');
const { GraphQLInt,GraphQLID,GraphQLList , GraphQLInputObjectType,GraphQLScalarType,GraphQLString,GraphQLBoolean ,GraphQLError} = require('graphql');
const base64Img = require('base64-img');
const isBase64 = require('is-base64');
const fs   = require('fs');
const UploadBase64OnS3 = require('../../../upload/base64_upload'),
    { AWSCredentails } = require('../../../upload/aws_constants');
const { verifyToken } = require('../middleware/middleware');

/**
    * Admin Login
    * @param {$admin_email} email
    * @param {$admin_password}  password
    * @returns {adminDetails Array}
    */

    // variant object
    const VariantsAttribute = new GraphQLInputObjectType({
     name : "VariantInput",
     fields: () => ({
        Name : { type: GraphQLString },
        Value : {type: GraphQLString }
     })
    });

const AddProductVariant = {
      type:VariantsType,
      args: {
          _id:{type: GraphQLString }, 
          ProductID: { type: GraphQLString } ,
          MerchantID :{ type : GraphQLString },
          SellingPrice  : { type : GraphQLString },
          CostPrice  : { type : GraphQLString },
          VariantStock  : { type: GraphQLString },
          VariantSKU : { type : GraphQLString },
          VariantImage : { type : GraphQLString },
          ProductVariants :{ type: new GraphQLList(VariantsAttribute) }
       },
       resolve: async (parent, args, context) => {
        const id = await verifyToken(context);
          if(args._id){
           let imagePath = await UploadBase64OnS3(args.VariantImage, AWSCredentails.AWS_PRODUCT_THUMBNAIL );  
           return await Variants.findOneAndUpdate(
               { _id: args._id},
               { $set: { ProductID: args.ProductID,
                MerchantID: args.MerchantID,
                SellingPrice: args.SellingPrice,
                CostPrice: args.CostPrice,
                VariantStock: args.VariantStock,
                VariantSKU: args.VariantSKU,
                VariantImage: imagePath,
                ProductVariants: args.ProductVariants
                }
               }).catch(err => new Error(err));
          } else {
         let imagePath = await UploadBase64OnS3(args.VariantImage, AWSCredentails.AWS_PRODUCT_THUMBNAIL );    
        let VariantConstant = new Variants({
                ProductID: args.ProductID,
                MerchantID: args.MerchantID,
                MerchatLogo :imagePath,
                SellingPrice: args.SellingPrice,
                CostPrice :args.CostPrice,
                VariantStock : args.VariantStock,
                VariantSKU :args.VariantSKU,
                ProductVariants : args.ProductVariants,
                VariantImage:imagePath
          });
         let variant_response = await VariantConstant.save();
         return variant_response;
        } 
      }
    };

const RemoveProductVariant = {
  type : VariantsType,
  args : {
    _id:{type: GraphQLString },
    ProductID: { type: GraphQLString } ,
    MerchantID:{type: GraphQLString }
  },
  resolve: async (parent, args, context) => {
             const id = await verifyToken(context);
             if(args._id){
              return await Attributes.findOneAndDelete(
                     { _id: args._id,ProductID:args.ProductID,
                      MerchantID:args.MerchantID
                     }).catch(err => new Error(err));
                } 
           }
     };

const VariantArray = { AddProductVariant,RemoveProductVariant};
module.exports = VariantArray;
