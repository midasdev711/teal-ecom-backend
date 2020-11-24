var mongoose = require("mongoose");
const { get } = require("lodash");
const StoreModel = mongoose.model("stores");
const UploadBase64OnS3 = require("../../../upload/base64_upload");
const { AWSNewCredentials } = require("../../../upload/aws_constants");
module.exports = {
  index: async (root, args, context) => {
    const StoreData = await StoreModel.find()

    return StoreData;
  },
  upsert: async (root, args, context) => {
    // const id = await verifyToken(context);
    let attributes = get(args, "store");
    console.log('222222222222222222', attributes, args)
    return StoreModel.create(attributes);
  },
};

const buildFindQuery = async ({ args, UserID }) => {
  if (get(args, "topStores")) {
    return StoreModel.all;
  }

};
