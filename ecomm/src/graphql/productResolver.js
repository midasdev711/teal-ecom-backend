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
    console.log('args', args);
    const id = await verifyToken(context);
    let productObj = {}
    let attributes = get(args, "product");
    if (id.UserID) {
      attributes.productMerchantID = id.UserID;
    }


    //product-thubnail ,featured and productImages upload
    // let { createReadStream, filename, mimetype } = await attributes.productThumbnailImage;
    let createReadStream;
    let filename;
    let mimetype;
    let thumbnailData = attributes.productThumbnailImage;
    try {
      thumbnailData.then((data) => {
        if (data) {
          createReadStream = data.createReadStream
          filename = data.filename
          mimetype = data.mimetype
        }
      })

    } catch (error) {
      console.log('error  while getting stream data of thumbnail image', error)
    }

    let createReadStream1;
    let filename1;
    let mimetype1;

    let featuredImage;
    let featuredData = attributes.productFeaturedImage;
    try {
      featuredData.then((data) => {
        createReadStream1 = data.createReadStream
        filename1 = data.filename
        mimetype1 = data.mimetype
      });
    } catch (error) {
      console.log('error while getting stream data of featured image\n', error)
    }



    // let productImageData = attributes.productImages;
    let imageArray = [];
    let imageValues = [];

    // //product image- uplaod to aws
    try {
      await Promise.all(productImageData).then((values) => {
        imageValues = values;
        let promises = imageValues.map(async (obj) => {
          let createReadStream1 = obj.createReadStream
          let filename1 = obj.filename;
          let mimetype1 = obj.mimetype;
          try {
            let url = await uploadUrl(filename1, createReadStream1, mimetype1, AWSCredentails.AWS_PRODUCT_IMG_PATH);
            imageArray.push(url);
          } catch (error) {
            console.log('error while uploading product images to amazon S3 bucket\n', error)
          }

        });
        Promise.all(promises);
      });

    } catch (error) {
      console.log('error while getting stream data of product images\n', error)
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
    try {
      let thumbImgUrl = await uploadUrl(filename, createReadStream, mimetype, AWSCredentails.AWS_PRODUCT_THUMBNAIL)
      thumbNailImage = thumbImgUrl;

    } catch (error) {
      console.log('error while uploading thumbnail image to amazon S3 bucket\n', error)
    }

    // featured image- upload to aws
    try {
      let featuredImgUrl = await uploadUrl(filename1, createReadStream1, mimetype1, AWSCredentails.AWS_PRODUCT_IMG_PATH)
      featuredImage = featuredImgUrl;

    } catch (error) {
      console.log('error while uploading featured image to amazon S3 bucket\n', error)
    }

    if (attributes.productId !== null) {
      let productData = await ProductModel.findOne({ ID: attributes.productId });
      if (productData !== null) {
        let updateObj = {};
        updateObj.merchantID = attributes.productMerchantID;;
        updateObj.merchantName = attributes.productMerchantName;
        updateObj.sku = attributes.productSKU;
        updateObj.title = attributes.productTitle;
        updateObj.slug = attributes.productSlug;
        updateObj.description = attributes.productDescription;
        updateObj.mrp = attributes.productMRP;
        updateObj.salePrice = attributes.productSalePrice;
        updateObj.thumbnailImage = thumbNailImage;
        updateObj.featuredImage = featuredImage;
        updateObj.images = imageArray;
        updateObj.category = productCat;
        updateObj.subCategory = productSubCat;
        updateObj.seo = attributes.productSEO;
        updateObj.attributes = attributes.productAttributes;
        updateObj.ampSlug = attributes.ampSlug;
        updateObj.totalQuantity = attributes.productTotalQuantity;
        updateObj.stock = attributes.productStock;
        updateObj.tags = attributes.productTags;
        updateObj.startDate = attributes.productStartDate;
        updateObj.endDate = attributes.productEndDate;
        updateObj.isPublish = attributes.isPublish;
        if (updateObj.isPublish === undefined || updateObj.isPublish === null) {
          updateObj.isPublish = 'false';
        }
        updateObj.variants = attributes.productVariants;
        updateObj.productCost = attributes.productCostPerItem;
        return await ProductModel.findOneAndUpdate({ ID: attributes.productId }, { $set: updateObj }, { new: true })
      }

    }



    productObj.merchantID = attributes.productMerchantID;;
    productObj.merchantName = attributes.productMerchantName;
    productObj.sku = attributes.productSKU;
    productObj.title = attributes.productTitle;
    productObj.slug = attributes.productSlug;
    productObj.description = attributes.productDescription;
    productObj.mrp = attributes.productMRP;
    productObj.salePrice = attributes.productSalePrice;
    productObj.thumbnailImage = thumbNailImage;
    productObj.featuredImage = featuredImage;
    productObj.images = imageArray;
    productObj.category = productCat;
    productObj.subCategory = productSubCat;
    productObj.seo = attributes.productSEO;
    productObj.attributes = attributes.productAttributes;
    productObj.ampSlug = attributes.ampSlug;
    productObj.totalQuantity = attributes.productTotalQuantity;
    productObj.stock = attributes.productStock;
    productObj.tags = attributes.productTags;
    productObj.startDate = attributes.productStartDate;
    productObj.endDate = attributes.productEndDate;
    productObj.isPublish = attributes.isPublish;
    if (productObj.isPublish === undefined || productObj.isPublish === null) {
      productObj.isPublish = 'false';
    }
    productObj.variants = attributes.productVariants;
    productObj.productCost = attributes.productCostPerItem;
    return ProductModel.create(productObj);

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
    'Key': `${Path}/`+ uuidv4() + '.' + filename.split('.')[1],
    'ACL': 'public-read',
    'Body': streadData(),
    'ContentType': mimetype
  };


  var s3Bucket = new AWS.S3();
  const { Location } = await s3Bucket.upload(params).promise();
  return Location
}