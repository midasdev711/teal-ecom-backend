var mongoose = require("mongoose");
const { get } = require("lodash");
const CustomerModel = mongoose.model("customers");
const UploadBase64OnS3 = require("../../../upload/base64_upload");
const { AWSNewCredentials } = require("../../../upload/aws_constants");
module.exports = {
  index: async (root, args, context) => {
    const customerData = await CustomerModel.find()

    return customerData;
  },
  upsert: async (root, args, context) => {
    // const id = await verifyToken(context);
    let attributes = get(args, "customer");
    console.log('222222222222222222', attributes, args)
    return CustomerModel.create(attributes);
  },
};

const buildFindQuery = async ({ args, UserID }) => {
  if (get(args, "topCustomers")) {
    return CustomerModel.all;
  }

};
