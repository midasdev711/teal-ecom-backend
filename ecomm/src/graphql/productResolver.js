var mongoose = require("mongoose");
const { get } = require("lodash");
const ProductModel = mongoose.model("products");
const { AWSCredentails } = require("../../../upload/aws_constants");
const { verifyToken } = require("../../schema/middleware/middleware");
var AWS = require("aws-sdk")
const { v4: uuidv4 } = require('uuid');
const { AWSNewCredentials } = require("../../../upload/aws_constants");

module.exports = {
  index: async (root, args, context) => {
    if (context.userAuthenticate) {
      if (context.apiKey) {
        let arrID = context.apiKey.split("_");
        let arrDomain = context.apiKey.split("%");
        if (arrDomain[0] == "teal.com") args.UserID = arrID[1];
      } else {
        args.UserID = null;
      }
    }
    const productData = await buildFindQuery({
      args: args.filters,
      UserID: args.UserID,
    });

    return productData;
  },

  getProductByMerchant: async (root, args, context) => {
    let productByMerchant = await ProductModel.find({ merchantID: args.ID });
    if (productByMerchant) {
      return productByMerchant;
    }
  },

  upsert: async (root, args, context) => {
    try {
      const id = await verifyToken(context);
      let attributes = get(args, "product");
      if (id.UserID) {
        attributes.productMerchantID = id.UserID;
      }


      //product-thubnail ,featured and productImages upload
      let thumbnailStreamData = {}
      let thumbnailData = await attributes.productThumbnailImage;
      if (thumbnailData) {
        thumbnailStreamData.createReadStream = thumbnailData.createReadStream
        thumbnailStreamData.filename = thumbnailData.filename
        thumbnailStreamData.mimetype = thumbnailData.mimetype
      }




      let featureStreamData = {};
      let featuredImage;
      let featuredData = await attributes.productFeaturedImage;
      if (featuredData) {
        featureStreamData.createReadStream = featuredData.createReadStream
        featureStreamData.filename = featuredData.filename
        featureStreamData.mimetype = featuredData.mimetype
      }


      let productImageData = attributes.productImages;
      let imageArray = [];
      let imageValues = [];

      if (productImageData) {
        imageValues = await Promise.all(productImageData);
      }


      if (imageValues !== undefined) {
        for (const imgObj of imageValues) {
          let createReadStream1 = imgObj.createReadStream
          let filename1 = imgObj.filename;
          let mimetype1 = imgObj.mimetype;
          let url = await uploadUrl(filename1, createReadStream1, mimetype1, AWSCredentails.AWS_PRODUCT_IMG_PATH);
          imageArray.push(url);
        }
      }


      let productCat = [];
      let productCatObj = {};
      productCatObj.ID = attributes.productCategory
      productCat.push(productCatObj);


      let productSubCat = [];
      let productSubCatObj = {};
      productSubCatObj.ID = attributes.productSubcategory
      productSubCat.push(productSubCatObj)


      let thumbNailImage;

      // thumbnail image-upload to aws
      if (thumbnailStreamData !== undefined && thumbnailStreamData !== null && thumbnailStreamData.length > 0) {
        let thumbImgUrl = await uploadUrl(thumbnailStreamData.filename, thumbnailStreamData.createReadStream, thumbnailStreamData.mimetype, AWSCredentails.AWS_PRODUCT_THUMBNAIL)
        thumbNailImage = thumbImgUrl;
      }



      // featured image- upload to aws
      if (featureStreamData !== undefined && featureStreamData !== null && featureStreamData.length > 0) {
        let featuredImgUrl = await uploadUrl(featureStreamData.filename, featureStreamData.createReadStream, featureStreamData.mimetype, AWSCredentails.AWS_PRODUCT_IMG_PATH)
        featuredImage = featuredImgUrl;
      }


      //product update
      if (attributes.productId !== null) {
        let productData = await ProductModel.findOne({ ID: attributes.productId });
        if (productData !== null) {
          let updateData = {};
          let productInsertObj = await insertOrUpdate(updateData, attributes, thumbNailImage, featuredImage, imageArray, productCat, productSubCat);
          return await ProductModel.findOneAndUpdate({ ID: attributes.productId }, { $set: productInsertObj }, { new: true })
        }
      }

      //new product insert
      let insertProductData = {};
      let productInsertObj = await insertOrUpdate(insertProductData, attributes, thumbNailImage, featuredImage, imageArray, productCat, productSubCat);
      return ProductModel.create(productInsertObj);

    } catch (error) {
      console.log('Error while creating product', error);
      throw error;
    }


  },

  fileUpload: async (root, args, context) => {
    return args.file.then(file => {
      //file.createReadStream() is a readable node stream that contains the contents of the uploaded file
      console.log('file', file.createReadStream());

      return file;
    });
  },
  removeProduct: async (root, args, context) => {
    const id = await verifyToken(context);
    let removedProductData = await ProductModel.findOneAndDelete({ ID: args.ID });
    if (removedProductData) {
      let message = `Product with id - ${removedProductData.ID} removed sucessfully`;
      let responseObj = { ID: removedProductData.ID, title: removedProductData.title, message: message }
      return responseObj;
    }

  }
};

const buildFindQuery = async ({ args, UserID }) => {
  if (get(args, "topProducts")) {
    return ProductModel.find({ status: 1 }).sort({ ID: 1 }).limit(3);
  }

  if (get(args, "productIds")) {
    return ProductModel.find({
      ID: { $in: get(args, "productIds") },
      status: 1,
    });
  }

  if (
    get(args, "mainCategoryID") &&
    get(args, "subCategoryID") &&
    get(args, "sortField") &&
    get(args, "order")
  ) {
    let shopList;
    let sortField = args.sortField;
    let order = args.order;

    if (args.mainCategoryID === 0) {
      shopList = await ProductModel.find({ status: 1 }).sort({
        [sortField]: [order],
      });
    } else {
      if (args.subCategoryID === 0) {
        shopList = await ProductModel.aggregate([
          { $match: { "category.ID": args.mainCategoryID } },
          {
            $sort: {
              [sortField]: [order],
            },
          },
        ]);
      } else {
        shopList = await ProductModel.aggregate([
          {
            $match: {
              "category.ID": args.mainCategoryID,
              "subCategory.ID": args.subCategoryID,
            },
          },
          {
            $sort: {
              [sortField]: [order],
            },
          },
        ]);
      }
    }
    return shopList;
  }

  if (get(args, "search") && get(args, "merchantID")) {
    if (args.search == undefined) {
      return ProductModel.find({
        merchantID: args.merchantID,
        status: 1,
      }).sort({ ID: -1 });
    } else {
      return ProductModel.find({
        $or: [{ title: { $regex: args.search }, status: 1 }],
      }).sort({ _id: -1 });
    }
  }


};



//upload to amazon s3 func
const uploadUrl = async (filename, streadData, mimetype, Path) => {
  AWS.config.setPromisesDependency(require("bluebird"));
  AWS.config.update({
    accessKeyId: AWSNewCredentials.credentials.accessKeyId,
    secretAccessKey: AWSNewCredentials.credentials.secretAccessKey,
    region: AWSNewCredentials.Region,
  });

  let params = {
    'Bucket': AWSNewCredentials.Bucket,
    'Key': `${Path}/` + uuidv4() + '.' + filename.split('.')[1],
    'ACL': 'public-read',
    'Body': streadData(),
    'ContentType': mimetype
  };


  var s3Bucket = new AWS.S3();
  const { Location } = await s3Bucket.upload(params).promise();
  return Location
}

//product - request data fetch 
const insertOrUpdate = async (uploadData, attributes, thumbNailImage, featuredImage, imageArray, productCat, productSubCat) => {
  uploadData.merchantID = attributes.productMerchantID;;
  uploadData.merchantName = attributes.productMerchantName;
  uploadData.sku = attributes.productSKU;
  uploadData.title = attributes.productTitle;
  uploadData.slug = attributes.productSlug;
  uploadData.description = attributes.productDescription;
  uploadData.mrp = attributes.productMRP;
  uploadData.salePrice = attributes.productSalePrice;
  uploadData.thumbnailImage = thumbNailImage;
  uploadData.featuredImage = featuredImage;
  uploadData.images = imageArray;
  uploadData.category = productCat;
  uploadData.subCategory = productSubCat;
  uploadData.seo = attributes.productSEO;
  uploadData.attributes = attributes.productAttributes;
  uploadData.ampSlug = attributes.ampSlug;
  uploadData.totalQuantity = attributes.productTotalQuantity;
  uploadData.stock = attributes.productStock;
  uploadData.tags = attributes.productTags;
  uploadData.startDate = attributes.productStartDate;
  uploadData.endDate = attributes.productEndDate;
  uploadData.isPublish = attributes.isPublish;
  if (uploadData.isPublish === undefined || uploadData.isPublish === null) {
    uploadData.isPublish = 'false';
  }
  uploadData.variants = attributes.productVariants;
  uploadData.productCost = attributes.productCostPerItem;
  return uploadData;

}