var mongoose = require("mongoose");
const { get } = require("lodash");
var Users = mongoose.model("users");
const ProductModel = mongoose.model("products");
const MerchantModel = mongoose.model("merchants");
const UserModel = mongoose.model("users");
const UploadBase64OnS3 = require("../../../upload/base64_upload");
const { AWSNewCredentials } = require("../../../upload/aws_constants");
const nodemailer = require('nodemailer');
const { EmailCredentials } = require("../../constant");
module.exports = {
  index: async (root, args, context) => {
    // if (context.userAuthenticate) {
    //   if (context.apiKey) {
    //     let arrID = context.apiKey.split("_");
    //     let arrDomain = context.apiKey.split("%");
    //     if (arrDomain[0] == "juicypie.com") args.UserID = arrID[1];
    //   } else {
    //     args.UserID = null;
    //   }
    // }
    const productData = await buildFindQuery({
      args: args.filters,
      UserID: args.UserID,
    });

    return productData;
  },
  upsert: async (root, args, context) => {
    // const id = await verifyToken(context);

    let attributes = get(args, "merchant");
    if (args.merchant.userId) {
      await UserModel.findOneAndUpdate(
        { ID: args.merchant.userId },
        { $set: args.merchant },
        { new: true }
      );
      return await MerchantModel.findOneAndUpdate(
        { userId: args.merchant.userId },
        { $set: args.merchant },
        { new: true }
      );
    }
    let merchantLogo = await UploadBase64OnS3(
      args.merchantLogo,
      AWSNewCredentials.AWS_PRODUCT_THUMBNAIL
    );

    let userObj = {
      name: args.merchant.name,
      email: args.merchant.email,
      password: args.merchant.password,
    };
    if (get(args.merchant, "name") && get(args.merchant, "email")) {
      userObj.description = args.merchant.name + "--" + args.merchant.email;
    }
    if (get(args.merchant, "name"))
      userObj.userName = await generateUserName(args.merchant.name);
    if (get(args.merchant, "password")) {
      userObj.password = passwordHash.generate(args.merchant.password);
    }
    userObj.uniqueID = uniqid();
    userObj.roleID = RoleObject.merchant;
    UserData = await Users.create(userObj);
    SaveUserSettings(userObj, UserData.ID);
    await generateToken(UserData);
    attributes.merchantLogo = merchantLogo;
    args.merchant.userId = UserData.ID;
    return MerchantModel.create(attributes);
  },
  inviteUser: async (root, args, context) => {
    try {
      let user = await Users.findOne({ email: args.invite.email }).lean();
      if (user === null) {
        if (args.invite.merchantId) {
          let merchant = await Users.findOne({ ID: args.invite.merchantId }).lean();
          if (merchant) {

            let merchantName = merchant.name;

            let transporter = nodemailer.createTransport({
              service: "gmail",
              User: EmailCredentials.USER_NAME,
              Password: EmailCredentials.PASSWORD,
              options: { debug: true },
              auth: {
                user: EmailCredentials.USER_NAME,
                pass: EmailCredentials.PASSWORD
              }
            });


            let mailOptions = {
              from: EmailCredentials.USER_NAME,
              to: args.invite.email,
              subject: "Invitation",
              html: '<!doctype html><html><head><meta charset="utf-8"><title>Slang</title></head><body><table width="800" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #110000; margin:0 auto; font-family: Arial, Helvetica, sans-serif; line-height:26px; color:#464646;"><tr><td style="background-color:#112a2c; padding:5px 15px;"></td></tr><tr><td style="padding:35px 25px;"><p style="padding:0px; color:#333333; font-size:16px; font-family:Arial, Helvetica, sans-serif; line-height:1.5;"> Hello Dear,' + "<b>" + args.invite.email + "</b>" + '</p><p style="color:#333333; font-size:14px; font-family:Arial, Helvetica, sans-serif; line-height:1.5;"> You have been invited by ' + merchantName + '</p><p> Click on this link to accept an  invitation <a href="http://18.219.187.89/login">Accept Invitation </a></p><p class="text-center"> Regards<br/>' + merchantName + '</p></td></tr><tr><td style="padding:5px 25px; color:#999; font-size:13px; line-height:20px;"><p>Notice: Please do not reply to this email address. This mailbox is not monitored and you will not receive a response.</p></td></tr></table></body></html>'
            };

            return new Promise(function (resolve, reject) {
              transporter.sendMail(mailOptions, async function (error, info) {
                if (error) {
                  console.log(error);
                  if(reject)
                  {
                    reject(new Error('error in sending mail', error.message))
                  }
                }
                else {
                  console.log('Email sent: ' + info.response);
                  resolve( {email: args.invite.email, message: "Email sent sucessfully"})
                }
              });

            });


          }
        }
      }
      else {
        return { email: args.invite.email, message: 'User is already registered.' }
      }
    } catch (error) {
      throw new Error(error.message)
    }


  }
};

const buildFindQuery = async ({ args, UserID }) => {
  if (get(args, "merchantIds")) {
    return MerchantModel.find({
      ID: { $in: get(args, "merchantIds") },
    });
  }
};

async function generateUserName(FullName) {
  FullName =
    (await FullName.trim().replace(/ /g, "-")) + "-" + (await makeid(4));
  return await FullName.toLowerCase();
}

