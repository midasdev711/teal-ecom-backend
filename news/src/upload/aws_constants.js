/*
 * Created By : Ankita Solace
 * Created Date : 10-02-2020
 * Purpose : Declare all constants
 */

const AWSCredentails = {
  credentials: {
    accessKeyId: "AKIAVHYRQR3GKO5SU24Z",
    secretAccessKey: "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",
  },
  Region: "us-east-2",
  Timeout: 5000,
  Bucket: "teal-cdn",
  ContentEncoding: "base64",
  ContentType: "image/png",
  ACL: "public-read-write",
  // AWS_BASE_URL : "https://teal.s3.us-east-2.amazonaws.com/",
  AWS_BASE_URL: "http://cdn.juicypie.com/",
  AWS_USER_IMG_PATH: "users",
  AWS_SHOP_IMG_PATH: "shop",
  AWS_PRODUCT_IMG_PATH: "shop/products",
  AWS_THUMBNAIL: "/thumnail",
  AWS_STORIES_IMG_PATH: "stories",
  AWS_PRODUCT_THUMBNAIL: "products/thumbnail",
};

const AWSNewCredentials = {
  credentials: {
    accessKeyId: "AKIAZJFDPVS2NPKFUUUU",
    secretAccessKey: "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",
  },
  Region: "us-east-2",
  Timeout: 5000,
  Bucket: "teal-backend",
  ContentEncoding: "base64",
  ContentType: "image/png",
  ACL: "public-read",
  // AWS_BASE_URL: "https://teal.s3.us-east-2.amazonaws.com/",
  // AWS_BASE_URL : "http://cdn.juicypie.com/",
  AWS_USER_IMG_PATH: "users",
  AWS_ARTICLES_PATH: "articles",
  AWS_SHOP_IMG_PATH: "shop",
  AWS_PRODUCT_IMG_PATH: "shop/products",
  AWS_THUMBNAIL: "/thumbnail",
  AWS_STORIES_IMG_PATH: "stories",
  AWS_PRODUCT_THUMBNAIL: "products/thumbnail",
};

const LocalFolderImagePath = "images";
const UserLocalImagePath = "avatar";

const ConstantArray = {
  AWSCredentails,
  LocalFolderImagePath,
  UserLocalImagePath,
  AWSNewCredentials,
};
module.exports = ConstantArray;
