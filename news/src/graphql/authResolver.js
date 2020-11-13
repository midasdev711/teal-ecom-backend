const Users = require("../models/users");
const { GraphQLEmail } = require("graphql-custom-types");
const { ArticleStatusConst, RoleObject } = require("../constant");
const { generateToken, verifyToken } = require("../middleware/middleware");
const emailValidator = require("email-validator");
const uniqid = require("uniqid");
const { get } = require("lodash");
const sendMailToUser = require("../mail/signup");
const UserSettings = require("../models/user_settings");
const passwordHash = require("password-hash");
// const bcrypt = require("bcrypt");
const apiKeys = require("../models/api_key");
const verifyCode = require("../models/verification_code");
// const Users = require("../models/users");

const dotenv = require("dotenv");
const postmark = require("postmark");
const twilio = require("twilio");
dotenv.config();

module.exports = {
  index: async (root, args, context) => {
    console.log(args);
    const data = await userQuery({ args: args });

    // let data = await Users.find(findQuery);
    return data;
  },

  socialAuth: async (root, args, context) => {
    const data = await userQuery({ args: args });
    return data;
  },

  upsert: async (root, args, context) => {
    let user = {};
    if (args.auth.userId) user = await Users.findOne({ ID: args.auth.userId });

    if (get(user, "ID")) {
      return await Users.findOneAndUpdate({ ID: args.auth.userId }, args.auth, {
        new: true,
      });
    } else {
      if (get(args.auth, "name") && get(args.auth, "email")) {
        args.auth.description = args.auth.name + "--" + args.auth.email;
      }
      if (get(args.auth, "name"))
        args.auth.userName = await generateUserName(args.auth.name);
      if (get(args.auth, "password")) {
        args.auth.password = passwordHash.generate(args.auth.password);
      }
      console.log("auth upsert: ", args);

      args.auth.uniqueID = uniqid();
      args.auth.roleID = RoleObject.auth;
      UserData = await Users.create(args.auth);
      SaveUserSettings(args.auth, UserData.ID);
      return await generateToken(UserData);
    }
  },

  createAPIKey: async (root, args, context) => {
    let user = {};
    let id = parseInt(args);
    if (args.UserID) user = await Users.findOne({ ID: args.UserID });
    console.log(id, args);
    if (user) {
      const uniqueId = uniqid();
      const timeStamp = await getTimeStamp();
      let APIKey = `juicypie.com%${uniqueId}${user._id}${timeStamp}_${user.ID}`;
      let obj = {
        apiKey: APIKey,
        userID: user.ID,
        user_id: user._id,
      };
      let updateData = await apiKeys.update(
        { user_id: user._id },
        { $set: { isExpired: true } },
        { multi: true }
      );
      console.log(updateData);
      let data = await apiKeys.create(obj);
      console.log(data);
      return data.apiKey;
    } else {
      return "User not found";
    }
  },

  sendEmailVerifyCode: async (root, args, context) => {
    const email = args.email;
    const expireDate = Date.now();
    const digitalCode = getRandomNumberBetween(100000, 999999);
    const verifyObject = {
      email: email,
      provider: "email",
      expireDate: expireDate,
      code: digitalCode,
    };
    try {
      await verifyCode.updateOne({ email: email }, verifyObject, {
        upsert: true,
      });
      const client = new postmark.ServerClient(process.env.POSTMARK_CLIENT_KEY);
      return client
        .sendEmail({
          From: process.env.FORM_EMAIL,
          To: email,
          Subject: "Verify Email",
          HtmlBody: String(digitalCode),
          TextBody: "Hello from Juicypie",
          MessageStream: "outbound",
        })
        .then((res) => {
          return true;
        })
        .catch((err) => {
          return false;
        });
    } catch (error) {
      console.log("error to send email verification code: ", error);
      return false;
    }
  },

  sendMobileVerifyCode: async (root, args, context) => {
    try {
      const accountSid = process.env.TWILLIO_SIDE;
      const authToken = process.env.TWILLIO_AUTH_TOKEN;
      const client = new twilio(accountSid, authToken);

      const mobileNo = get(args, "mobileNo");
      const expireDate = Date.now();
      const digitalCode = getRandomNumberBetween(100000, 999999);

      const verifyObject = {
        mobileNo: mobileNo,
        provider: "mobile",
        expireDate: expireDate,
        code: digitalCode,
      };

      console.log("mobile verifyObject: ", verifyObject);

      await verifyCode.updateOne({ mobileNo: mobileNo }, verifyObject, {
        upsert: true,
      });
      const fromPhone = process.env.TWILLIO_PHONE;
      return client.messages
        .create({
          body: digitalCode,
          to: mobileNo,
          from: fromPhone, // From a valid Twilio number
        })
        .then((message) => {
          console.log("sentMessage: ", message.sid);
          return true;
        })
        .catch((err) => {
          console.log("twilio error: ", err);
          return false;
        });
    } catch (error) {
      console.log("error mobile verifyObject result: ", error);
      return false;
    }
  },

  verifyCode: async (root, args, context) => {
    if (get(args.codeObject, "provider") === "email") {
      const verifiedResult = await verifyCode.findOne({
        email: get(args.codeObject, "email"),
        code: get(args.codeObject, "code"),
      });
      if (verifiedResult) {
        return true;
      } else {
        return false;
      }
    } else {
      const verifiedResult = await verifyCode.findOne({
        mobileNo: get(args.codeObject, "mobileNo"),
        code: get(args.codeObject, "code"),
      });
      console.log("mobile verify code result: ", verifiedResult);
      if (verifiedResult) {
        return true;
      } else {
        return false;
      }
    }
  },
};

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getTimeStamp() {
  const date = new Date();
  return (timestamp = date.getTime());
}

async function SaveUserSettings(args, UserID) {
  console.log("objectzxzxzx", UserID);
  let UserSettingsConstant = new UserSettings({
    userID: UserID,
  });
  await UserSettings.create({ userID: UserID });
}

async function generateUserName(FullName) {
  FullName =
    (await FullName.trim().replace(/ /g, "-")) + "-" + (await makeid(4));
  return await FullName.toLowerCase();
}

async function makeid(length) {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  // console.log(result,"result");

  return await result;
}

const userQuery = async ({ args }) => {
  if (get(args, "uniqueID") && get(args, "password")) {
    let data;
    let valid = emailValidator.validate(args.uniqueID);
    if (valid) {
      data = await Users.findOne({
        email: args.uniqueID,
        status: 1,
        isVerified: 1,
      });
    } else {
      data = await Users.findOne({
        uniqueID: args.uniqueID,
        status: 1,
        isVerified: 1,
      });
    }

    if (data) {
      if (passwordHash.verify(args.password, data.password)) {
        let apiKey = await apiKeys.findOne({
          userID: parseInt(data.ID),
          isExpired: false,
        });
        if (get(apiKey, "apiKey")) {
          data.apiKey = apiKey.apiKey;
        }
        return data ? await generateToken(data) : [];
      } else throw new Error("Password does not match");
    } else throw new Error("This user does not exists");
  }

  if (get(args, "email") && get(args, "signUpMethod")) {
    const data = await Users.findOne({
      email: args.email,
      signUpMethod: args.signUpMethod,
      status: 1,
      isVerified: 1,
    });
    console.log("yes", data);

    if (data) {
      let apiKey = await apiKeys.findOne({
        userID: parseInt(data.ID),
        isExpired: false,
      });
      if (get(apiKey, "apiKey")) {
        data.apiKey = apiKey.apiKey;
      }
      return data ? await generateToken(data) : [];
    } else throw new Error("This user does not exists");
  }
};
