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
        if (arrDomain[0] == "juicypie.com") args.UserID = arrID[1];
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

    let productByMerchant = await ProductModel.find({ merchantID: args.ID }).lean();
    if (productByMerchant) {
      for await (let mProduct of productByMerchant) {


        if (mProduct.category) {
          mProduct.category = mProduct.category[0].ID;
        }

        if (mProduct.subCategory) {
          mProduct.subCategory = mProduct.subCategory[0].ID
        }

      }
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
      let thumbnailData = null;
      if (attributes.productThumbnailImage) {
        thumbnailData = await attributes.productThumbnailImage;
      }


      let featuredData = null;
      if (attributes.productFeaturedImage) {
        featuredData = await attributes.productFeaturedImage;
      }


      let productImageData = attributes.productImages;
      let imageArray = [];
      let imageValues = [];

      if (productImageData && productImageData.length) {
        imageValues = await Promise.all(productImageData);
      }


      if (imageValues && imageValues.length) {
        for (const imgObj of imageValues) {
          const { filename, createReadStream, mimetype } = imgObj;
          let url = await uploadUrl(filename, createReadStream, mimetype, AWSCredentails.AWS_PRODUCT_IMG_PATH);
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
      let featuredImage;

      // thumbnail image-upload to aws
      if (thumbnailData) {
        let thumbImgUrl = await uploadUrl(thumbnailData.filename, thumbnailData.createReadStream, thumbnailData.mimetype, AWSCredentails.AWS_PRODUCT_THUMBNAIL)
        thumbNailImage = thumbImgUrl;
      }



      // featured image- upload to aws
      if (featuredData) {
        let featuredImgUrl = await uploadUrl(featuredData.filename, featuredData.createReadStream, featuredData.mimetype, AWSCredentails.AWS_PRODUCT_IMG_PATH)
        featuredImage = featuredImgUrl;
      }

      let productExistingImages = [];

      //new product insert
      let insertProductData = {};
      let productInsertObj = await insertOrUpdate(insertProductData, attributes, thumbNailImage, featuredImage, imageArray, productCat, productSubCat, productExistingImages);
      let productInsert = await ProductModel.create(productInsertObj);
      if (productInsert !== null) {
        productInsert = JSON.parse(JSON.stringify(productInsert));
        if (productInsert.category) {
          productInsert.category = productInsert.category[0].ID;
        }
        if (productInsert.subCategory) {
          productInsert.subCategory = productInsert.subCategory[0].ID;
        }
      }
      return productInsert;

    } catch (error) {
      console.log('Error while creating product', error);
      throw error;
    }


  },


  editProduct: async (root, args, context) => {

    try {
      const id = await verifyToken(context);
      let attributes = get(args, "product");
      if (id.UserID) {
        attributes.productMerchantID = id.UserID;
      }


      //product-thubnail ,featured and productImages upload
      let thumbnailData = null;
      if (attributes.productThumbnailImage) {
        thumbnailData = await attributes.productThumbnailImage;
      }

      // let featuredImage = null;
      let featuredData = null;
      if (attributes.productFeaturedImage) {
        featuredData = await attributes.productFeaturedImage;
      }


      let productImageData = attributes.productImages;
      let imageArray = [];
      let imageValues = [];

      if (productImageData && productImageData.length) {
        imageValues = await Promise.all(productImageData);
      }


      if (imageValues && imageValues.length) {
        for (const imgObj of imageValues) {
          const { filename, createReadStream, mimetype } = imgObj;
          let url = await uploadUrl(filename, createReadStream, mimetype, AWSCredentails.AWS_PRODUCT_IMG_PATH);
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
      let featuredImage;

      // thumbnail image-upload to aws
      if (thumbnailData) {
        let thumbImgUrl = await uploadUrl(thumbnailData.filename, thumbnailData.createReadStream, thumbnailData.mimetype, AWSCredentails.AWS_PRODUCT_THUMBNAIL)
        thumbNailImage = thumbImgUrl;
      }



      // featured image- upload to aws
      if (featuredData) {
        let featuredImgUrl = await uploadUrl(featuredData.filename, featuredData.createReadStream, featuredData.mimetype, AWSCredentails.AWS_PRODUCT_IMG_PATH)
        featuredImage = featuredImgUrl;
      }

      let productExistingImages = [];


      if (attributes.productId !== null) {
        let productData = await ProductModel.findOne({ ID: attributes.productId });
        if (productData !== null) {
          if (attributes.productExistingImages !== null) {
            productExistingImages = attributes.productExistingImages;
          }
          let updateData = {};
          let productInsertObj = await insertOrUpdate(updateData, attributes, thumbNailImage, featuredImage, imageArray, productCat, productSubCat, productExistingImages);
          let updatedProduct = await ProductModel.findOneAndUpdate({ ID: attributes.productId }, { $set: productInsertObj }, { new: true }).lean()
          if (updatedProduct !== null) {
            if (updatedProduct.category) {
              updatedProduct.category = updatedProduct.category[0].ID;
            }
            if (updatedProduct.subCategory) {
              updatedProduct.subCategory = updatedProduct.subCategory[0].ID;
            }
          }
          return updatedProduct;
        }
      }

    } catch (error) {
      console.log('Error while updating product', error);
      throw error;
    }

  },

  fileUpload: async (root, args, context) => {
    return args.file.then(file => {
      //file.createReadStream() is a readable node stream that contains the contents of the uploaded file
      // console.log('file', file.createReadStream());

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

  },
  getAllProductsListing: async (root, args) => {
    let products = await ProductModel.find({ isPublish: "true" }).select('merchantName  images   thumbnailImage attributes  variants tags description sku title salePrice stock').lean();
    if (products) {
      return products;
    }

  }
};

const buildFindQuery = async ({ args, UserID }) => {
  if (get(args, "topProducts")) {
    return ProductModel.find({ status: 1 }).sort({ ID: 1 }).limit(3);
  }

  if (get(args, "productIds")) {
    let attributes = get(args, "productIds");
    let products = await ProductModel.find({ ID: { $in: attributes }, status: 1 }).lean();
    if (products) {
      for await (let mProduct of products) {
        if (mProduct.category) {
          mProduct.category = mProduct.category[0].ID;
        }

        if (mProduct.subCategory) {
          mProduct.subCategory = mProduct.subCategory[0].ID
        }

      }
      return products;
    }
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
    'Key': `${Path}/` + uuidv4() + '.' + filename.split('.').pop(),
    'ACL': 'public-read',
    'Body': streadData(),
    'ContentType': mimetype
  };


  var s3Bucket = new AWS.S3();
  const { Location } = await s3Bucket.upload(params).promise();
  return Location
}

//product - request data fetch 
const insertOrUpdate = async (uploadData, attributes, thumbNailImage, featuredImage, imageArray, productCat, productSubCat, productExistingImages) => {
  uploadData.merchantID = attributes.productMerchantID;;
  uploadData.merchantName = attributes.productMerchantName;
  uploadData.sku = attributes.productSKU;
  uploadData.title = attributes.productTitle;
  uploadData.slug = attributes.productSlug;
  uploadData.description = attributes.productDescription;
  uploadData.mrp = attributes.productMRP;
  uploadData.salePrice = attributes.productSalePrice;
  uploadData.yourShippingCost = attributes.productYourShippingCost;
  uploadData.shippingCost = attributes.productShippingCost;
  uploadData.variants = attributes.productVariants;

  if (thumbNailImage) {
    uploadData.thumbnailImage = thumbNailImage;
  }

  if (featuredImage) {
    uploadData.featuredImage = featuredImage;
  }

  if (imageArray && imageArray.length) {
    uploadData.images = imageArray;
  }


  if (attributes.productId !== null && attributes.productId !== undefined) {
    let findProductImg = await ProductModel.findOne({ ID: attributes.productId });
    let dbImgArr = findProductImg.images;

    let modifledExisiting = [];

    //remove deleted image from db and aws
    if (productExistingImages.length > 0 && dbImgArr.length > 0) {
      modifledExisiting = dbImgArr.filter(function (obj) { return productExistingImages.indexOf(obj) == -1; });
      const newArr = dbImgArr.filter(function (obj) { return modifledExisiting.indexOf(obj) != -1; });

      let updatePro = await ProductModel.findOne({ ID: attributes.productId });
      updatePro = JSON.parse(JSON.stringify(updatePro));




      //remove images from aws
      if (modifledExisiting.length > 0) {
        for (let j = 0; j < modifledExisiting.length; j++) {
          let imgFileName;
          imgFileName = modifledExisiting[j].substr(modifledExisiting[j].lastIndexOf("/") + 1);
          await removeImageFromAWS(imgFileName, 'product');
        }

      }


      //update images array to db
      if (modifledExisiting.length > 0) {
        await ProductModel.findOneAndUpdate({ ID: attributes.productId }, { $set: { images: newArr } }, { new: true });
      }

    }


    //remove thumbnail image and product images  from db and aws
    if (productExistingImages.length === 0 && imageArray.length === 0) {
      let modelData = await ProductModel.findOne({ ID: attributes.productId });
      let deleteThumbnailImg = modelData.thumbnailImage;

      let deleteImages = modelData.images;
      for await (let mProductImg of deleteImages) {
        mProductImg = mProductImg.substr(mProductImg.lastIndexOf("/") + 1);
        await removeImageFromAWS(mProductImg, 'product');
      }
      await ProductModel.findOneAndUpdate({ ID: attributes.productId }, { $set: { images: [] } }, { new: true });

      deleteThumbnailImg = deleteThumbnailImg.substr(deleteThumbnailImg.lastIndexOf("/") + 1);
      await removeImageFromAWS(deleteThumbnailImg, 'thumbnail');
      await ProductModel.findOneAndUpdate({ ID: attributes.productId }, { $set: { thumbnailImage: '' } }, { new: true });
    }

    //remove old featured image while uploading  new image from db and aws
    if (uploadData.featuredImage) {
      let modelData = await ProductModel.findOne({ ID: attributes.productId });
      let deleteFeaturedImg = modelData.featuredImage;
      deleteFeaturedImg = deleteFeaturedImg.substr(deleteFeaturedImg.lastIndexOf("/") + 1);
      await removeImageFromAWS(deleteFeaturedImg, 'featured');
    }


  }



  if (uploadData.images && productExistingImages.length) {
    uploadData.images = uploadData.images.concat(productExistingImages);
  }

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

const removeImageFromAWS = async (filename, imgType) => {
  try {
    AWS.config.setPromisesDependency(require("bluebird"));
    AWS.config.update({
      accessKeyId: AWSNewCredentials.credentials.accessKeyId,
      secretAccessKey: AWSNewCredentials.credentials.secretAccessKey,
      region: AWSNewCredentials.Region,
    });

    var s3Bucket = new AWS.S3();
    let bucketkey = '';

    if (imgType === 'featured' || imgType === 'product') {
      bucketkey = `shop/products/${filename}`;
    }
    if (imgType === 'thumbnail') {
      bucketkey = `products/thumbnail/${filename}`;
    }

    s3Bucket.deleteObject({
      Bucket: AWSNewCredentials.Bucket,
      Key: bucketkey
    }, async function (err, data) {
      if (!err) {
        console.log('file deleted sucessfully')
      }
    });

  } catch (error) {
    console.log('error while removing images from aws\n', error.message);
    throw error;
  }


};