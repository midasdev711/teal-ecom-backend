var mongoose = require("mongoose");
const { get } = require("lodash");
const ProductModel = mongoose.model("products");
const UploadBase64OnS3 = require("../../../upload/base64_upload");
const { AWSCredentails } = require("../../../upload/aws_constants");
const { verifyToken } = require("../../schema/middleware/middleware");
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
    // let attributes = get(args, "product");
    const id = await verifyToken(context);
    let productObj = {}
    let attributes = get(args, "product");
    if (id.UserID) {
      attributes.productMerchantID = id.UserID;
    }


    let productCat = [];
    let productCatObj = {};
    productCatObj.ID = attributes.productCategory
    productCat.push(productCatObj);


    let productSubCat = [];
    let productSubCatObj = {};
    productSubCatObj.ID = attributes.productSubcategory
    productSubCat.push(productSubCatObj)


    let imageArray = [];
    let featuredImage = await UploadBase64OnS3(attributes.productFeaturedImage, AWSCredentails.AWS_PRODUCT_IMG_PATH);

    let thumbNailImage = await UploadBase64OnS3(attributes.productThumbnailImage, AWSCredentails.AWS_PRODUCT_THUMBNAIL)

    if (attributes.productImages.length > 0) {
      // attributes.productImages = attributes.productImages.split(",");
      let promises = attributes.productImages.map(async (item, index) => {
        let Image = item.split(";");
        let str1 = Image[0] + ";";
        let str2 = Image[2];
        let res = str1.concat(str2);
        let UploadedImage = await UploadBase64OnS3(
          res,
          AWSCredentails.AWS_PRODUCT_IMG_PATH
        );
        imageArray.push(UploadedImage);
      });
      await Promise.all(promises);
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
