var mongoose = require("mongoose");
const { get } = require("lodash");
const BlogModel = mongoose.model("blogs");
const UploadBase64OnS3 = require("../../../upload/base64_upload");
const { AWSNewCredentials } = require("../../../upload/aws_constants");
module.exports = {
  index: async (root, args, context) => {
    const blogData = await BlogModel.find()

    return blogData;
  },
  upsert: async (root, args, context) => {
    // const id = await verifyToken(context);

    console.log("asdasdasdasdasdasdasd")

    let attributes = get(args, "blog");
    console.log('222222222222222222', attributes, args)
    return BlogModel.create(attributes);
  },
};

const buildFindQuery = async ({ args, UserID }) => {
  if (get(args, "topBlogs")) {
    return BlogModel.all;
  }

};
