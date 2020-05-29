const Products = require('../../models/products');
const { ProductType } = require('../types/product_constant');
const { MerchantType } = require('../types/merchant_constant');
const { GraphQLInputObjectType,GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean ,GraphQLError} = require('graphql');
const { GraphQLEmail } = require('graphql-custom-types');
const Bcrypt = require('bcrypt');
const randtoken = require('rand-token');
const nodemailer = require('nodemailer');
const emailTemplates = require('email-templates');
const path = require('path');
const saltRounds = 10;
const base64Img = require('base64-img');
const isBase64 = require('is-base64');
const fs   = require('fs');
const UploadBase64OnS3 = require('../../../upload/base64_upload'),
    { AWSCredentails } = require('../../../upload/aws_constants');
const { verifyToken } = require('../middleware/middleware');


const ProductCategoryInputType = new GraphQLInputObjectType({
  name: "ParentCategoriesInputt",
  fields: () => ({
    ID: {
      type: GraphQLInt
    },
    Name: {
      type: GraphQLString
    },
    typename: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    },
    value: {
      type: GraphQLInt
    }
  })
});

// product sub categories input paramter
const ProductSubcategoryInputType = new GraphQLInputObjectType({
  name: "SubCategoriesInputt",
  fields: () => ({
    ID: {
      type: GraphQLInt
    },
    Name: {
      type: GraphQLString
    },
    ParentCategoryID: {
      type: GraphQLInt
    },
  })
});

// products Attribute object
const ProductsAttribute = new GraphQLInputObjectType({
 name : "AttributesInputt",
 fields: () => ({
    AttributsName : { type: GraphQLString },
    AttributeValues : {type: new GraphQLList(GraphQLString)}
 })
});

/**
  * Creating Product
  * @param {$Name} username
  * @param {$Email}  email
  * @param {$Password} passowrd
  * @param {$isVerified} reviewDetails
  * @param {$SignUpMethod} reviewDetails
  * @returns {$productDetails Array}
  */
const CreateProductsDetailByMerchant = {
  type: ProductType,
  args: {
    ProductMerchantID: {
      type: GraphQLInt
    },
    ProductSKU: {
      type: GraphQLString
    },
    ProductTitle: {
      type: GraphQLString
    },
    ProductDescription: {
      type: GraphQLString
    },
    ProductSalePrice: {
      type: GraphQLString
    },
    ProductMRP: {
      type: GraphQLString
    },
    ProductSlug: {
      type: GraphQLString
    },
    isPublish: {
      type: GraphQLString
    },
    ProductMerchantName: {
      type: GraphQLString
    },
    ProductFeaturedImage: {
      type: GraphQLString
    },
    ProductImage :{
      type : new GraphQLList(GraphQLString)
    },
    ProductSearchEngineTitle: {
      type: GraphQLString
    },
    ProductSearchEngineDescription: {
      type: GraphQLString
    },
    ProductCategory: {
      type: new GraphQLList(ProductCategoryInputType)
    },
    ProductSubcategory: {
      type: new GraphQLList(ProductSubcategoryInputType)
    },
    ProductTotalQuantity: {
      type: GraphQLInt
    },
    ProductStartDate: {
      type: GraphQLString
    },
    ProductAttributes:{ type :  new GraphQLList(ProductsAttribute) }

  },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);

    let imageArray = [] ;
    let ProductFeaturedImage = await UploadBase64OnS3(args.ProductFeaturedImage, AWSCredentails.AWS_PRODUCT_THUMBNAIL);

    if(args.ProductImage.length > 0)
    {

      let promises = args.ProductImage.map(async (item,index) => {
           let Image = item.split(";");

              let str1 = Image[0]+";";
              let str2 = Image[2];
              let res = str1.concat(str2);
            let UploadedImage = await UploadBase64OnS3(res,AWSCredentails.AWS_PRODUCT_THUMBNAIL);
           imageArray.push(UploadedImage)
      });
       
      await Promise.all(promises);
    }

    let AddProductConstant = new Products({
      ProductMerchantID: args.ProductMerchantID,
      ProductSKU: args.ProductSKU,
      ProductTitle: args.ProductTitle,
      ProductDescription: args.ProductDescription,
      ProductSlug: args.ProductSlug,
      ProductMRP: args.ProductMRP,
      ProductSalePrice: args.ProductSalePrice,
      isPublish: args.isPublish,
      ProductMerchantName: args.ProductMerchantName,
      ProductSearchEngineTitle: args.ProductSearchEngineTitle,
      ProductSearchEngineDescription: args.ProductSearchEngineDescription,
      ProductCategory: args.ProductCategory,
      ProductSubcategory: args.ProductSubcategory,
      ProductTotalQuantity: args.ProductTotalQuantity,
      ProductStartDate: args.ProductStartDate,
      ProductFeaturedImage: ProductFeaturedImage,
      ProductImages : imageArray,
      //ProductImages : args.ProductImage,
      ProductAttributes:args.ProductAttributes
    });
    return AddProductConstant.save();
  }
};



/**
  * update Product
  * @param {$_id} productID
  * @param {$Email}  email
  * @param {$Password} passowrd
  * @param {$isVerified} reviewDetails
  * @param {$SignUpMethod} reviewDetails
  * @returns {$productDetails Array}
  */

const UpdateProductDetail = {
  type: ProductType,
  args: {
    _id: {
      type: GraphQLString
    },
    ProductMerchantID: {
      type: GraphQLInt
    },
    ProductSKU: {
      type: GraphQLString
    },
    ProductTitle: {
      type: GraphQLString
    },
    ProductDescription: {
      type: GraphQLString
    },
    ProductSalePrice: {
      type: GraphQLString
    },
    ProductMRP: {
      type: GraphQLString
    },
    ProductSlug: {
      type: GraphQLString
    },
    isPublish: {
      type: GraphQLString
    },
    ProductMerchantName: {
      type: GraphQLString
    },
    ProductFeaturedImage: {
      type: GraphQLString
    },
    ProductSearchEngineTitle: {
      type: GraphQLString
    },
    ProductSearchEngineDescription: {
      type: GraphQLString
    },
    ProductCategory: {
      type: new GraphQLList(ProductCategoryInputType)
    },
    ProductSubcategory: {
      type: new GraphQLList(ProductSubcategoryInputType)
    },
    ProductAttributes:{ 
      type :  new GraphQLList(ProductsAttribute)
    },
    ProductTotalQuantity: {
      type: GraphQLInt
    },
    ProductStartDate: {
      type: GraphQLString
    },
  },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    if (isBase64(args.ProductFeaturedImage, {
        allowMime: true
      })) {
      let imagePath = await UploadBase64OnS3(args.ProductFeaturedImage, AWSCredentails.AWS_PRODUCT_THUMBNAIL);

      product_updates = await Products.findOneAndUpdate({
        _id: args._id
      }, {
        $set: {
          ProductMerchantID: args.ProductMerchantID,
          ProductSKU: args.ProductSKU,
          ProductTitle: args.ProductTitle,
          ProductDescription: args.ProductDescription,
          ProductSalePrice: args.ProductSalePrice,
          ProductMRP: args.ProductMRP,
          ProductSlug: args.ProductSlug,
          isPublish: args.isPublish,
          ProductMerchantName: args.ProductMerchantName,
          ProductFeaturedImage: imagePath,
          ProductSearchEngineTitle: args.ProductSearchEngineTitle,
          ProductSearchEngineDescription: args.ProductSearchEngineDescription,
          ProductCategory: args.ProductCategory,
          ProductSubcategory: args.ProductSubcategory,
          ProductTotalQuantity: args.ProductTotalQuantity,
          ProductStartDate: args.ProductStartDate,
          ProductAttributes:args.ProductAttributes,
        }
      }, {
        new: true
      });
    } else {
      product_updates = await Products.findOneAndUpdate({
        _id: args._id
      }, {
        $set: {
          ProductMerchantID: args.ProductMerchantID,
          ProductSKU: args.ProductSKU,
          ProductTitle: args.ProductTitle,
          ProductDescription: args.ProductDescription,
          ProductSalePrice: args.ProductSalePrice,
          ProductMRP: args.ProductSalePrice,
          ProductSlug: args.ProductSlug,
          isPublish: args.isPublish,
          ProductMerchantName: args.ProductMerchantName,
          ProductFeaturedImage: args.ProductFeaturedImage,
          ProductSearchEngineTitle: args.ProductSearchEngineTitle,
          ProductSearchEngineDescription: args.ProductSearchEngineDescription,
          ProductCategory: args.ProductCategory,
          ProductSubcategory: args.ProductSubcategory,
          ProductTotalQuantity: args.ProductTotalQuantity,
          ProductStartDate: args.ProductStartDate,
          ProductAttributes:args.ProductAttributes,
        }
      }, {
        new: true
      });
    }

    return product_updates;
  }
};


const ProductArray = { CreateProductsDetailByMerchant , UpdateProductDetail };
module.exports = ProductArray;
