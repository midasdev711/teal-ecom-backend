var mongoose = require("mongoose");
const { get } = require("lodash");
var Users = mongoose.model("users");
const ProductModel = mongoose.model("products");
const MerchantModel = mongoose.model("merchants");
const OrderModel = mongoose.model("orders");
const UserModel = mongoose.model("users");
const UploadBase64OnS3 = require("../../../upload/base64_upload");
const { AWSNewCredentials } = require("../../../upload/aws_constants");
module.exports = {
  index: async (root, args, context) => {
    const orderData = await OrderModel.find()

    return orderData;
    // if (context.userAuthenticate) {
    //   if (context.apiKey) {
    //     let arrID = context.apiKey.split("_");
    //     let arrDomain = context.apiKey.split("%");
    //     if (arrDomain[0] == "juicypie.com") args.UserID = arrID[1];
    //   } else {
    //     args.UserID = null;
    //   }
    // }
    // const orderData = await buildFindQuery({
    //   args: args.filters,
    //   UserID: args.UserID,
    // });

    // return orderData;
  },
  upsert: async (root, args, context) => {
    // const id = await verifyToken(context);

    let attributes = get(args, "order");
    // if (args.merchant.userId) {
    //   await UserModel.findOneAndUpdate(
    //     { ID: args.merchant.userId },
    //     { $set: args.merchant },
    //     { new: true }
    //   );
    //   return await MerchantModel.findOneAndUpdate(
    //     { userId: args.merchant.userId },
    //     { $set: args.merchant },
    //     { new: true }
    //   );
    // }
    // let merchantLogo = await UploadBase64OnS3(
    //   args.merchantLogo,
    //   AWSNewCredentials.AWS_PRODUCT_THUMBNAIL
    // );

    // let userObj = {
    //   name: args.merchant.name,
    //   email: args.merchant.email,
    //   password: args.merchant.password,
    // };
    // if (get(args.merchant, "name") && get(args.merchant, "email")) {
    //   userObj.description = args.merchant.name + "--" + args.merchant.email;
    // }
    // if (get(args.merchant, "name"))
    //   userObj.userName = await generateUserName(args.merchant.name);
    // if (get(args.merchant, "password")) {
    //   userObj.password = passwordHash.generate(args.merchant.password);
    // }
    // userObj.uniqueID = uniqid();
    // userObj.roleID = RoleObject.merchant;
    // UserData = await Users.create(userObj);
    // SaveUserSettings(userObj, UserData.ID);
    // await generateToken(UserData);
    // attributes.merchantLogo = merchantLogo;
    // args.merchant.userId = UserData.ID;
    console.log('222222222222222222', attributes)
    return OrderModel.create(attributes);
  },
};

const buildFindQuery = async ({ args, UserID }) => {
  if (get(args, "orderIds")) {
    return orderModel.find({
      ID: { $in: get(args, "orderIds") },
    });
  }
};

async function generateUserName(FullName) {
  FullName =
    (await FullName.trim().replace(/ /g, "-")) + "-" + (await makeid(4));
  return await FullName.toLowerCase();
}
