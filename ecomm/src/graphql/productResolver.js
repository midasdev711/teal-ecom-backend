var mongoose = require("mongoose");
const { get } = require("lodash");
var Users = mongoose.model("users");
const ProductModel = mongoose.model("products");
const UploadBase64OnS3 = require("../../../upload/base64_upload");
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
  upsert: async (root, args, context) => {
    const id = await verifyToken(context);

    let attributes = get(args, "product");
    if (id.UserID) {
      attributes.merchantID = id.UserID;
    }
    let imageArray = [];
    let featuredImage = await UploadBase64OnS3(
      args.featuredImage,
      AWSNewCredentials.AWS_PRODUCT_THUMBNAIL
    );

    if (args.image.length > 0) {
      let promises = args.image.map(async (item, index) => {
        let Image = item.split(";");

        let str1 = Image[0] + ";";
        let str2 = Image[2];
        let res = str1.concat(str2);
        let UploadedImage = await UploadBase64OnS3(
          res,
          AWSCredentails.AWS_PRODUCT_THUMBNAIL
        );
        imageArray.push(UploadedImage);
      });

      await Promise.all(promises);
    }
    attributes.featuredImage = featuredImage;

    return ProductModel.create(attributes);
  },
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
