var mongoose = require("mongoose");
const { get } = require("lodash");
const PageModel = mongoose.model("pages");
const UploadBase64OnS3 = require("../../../upload/base64_upload");
const { AWSNewCredentials } = require("../../../upload/aws_constants");
module.exports = {
  index: async (root, args, context) => {
    const pageData = await PageModel.find()

    return pageData;
  },
  upsert: async (root, args, context) => {
    // const id = await verifyToken(context);
    let attributes = get(args, "page");
    console.log('222222222222222222', attributes, args)
    return PageModel.create(attributes);
  },
};

const buildFindQuery = async ({ args, UserID }) => {
  if (get(args, "topPages")) {
    return PageModel.all;
  }

};
