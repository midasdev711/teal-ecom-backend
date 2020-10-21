const Users = require("../../../news/src/models/users");
const { GraphQLEmail } = require("graphql-custom-types");
const { ArticleStatusConst, RoleObject } = require("../../constant");
const { generateToken, verifyToken } = require("../../schema/middleware/middleware");
const emailValidator = require("email-validator");
const uniqid = require("uniqid");
const { get } = require("lodash");
// const sendMailToUser = require("../../");
const UserSettings = require("../../../news/src/models/user_settings");
const passwordHash = require("password-hash");
// const bcrypt = require("bcrypt");
const apiKeys = require("../../../news/src/models/api_key");

module.exports = {
  index: async (root, args, context) => {
    console.log(args);
    const data = await userQuery({ args: args });

    // let data = await Users.find(findQuery);
    return data;
  },

  upsert: async (root, args, context) => {
    console.log(args);
    if (get(args.auth, "name") && get(args.auth, "email")) {
      args.auth.description = args.auth.name + "--" + args.auth.email;
    }

    args.auth.uniqueID = uniqid();

    args.auth.roleID = RoleObject.auth;

    if (get(args.auth, "name"))
      args.auth.userName = await generateUserName(args.auth.name);

    if (get(args.auth, "signUpMethod") && get(args.auth, "password")) {
      args.auth.password = passwordHash.generate(args.auth.password);
    }

    let user = {};
    if (args.auth.userId) user = await Users.findOne({ ID: args.auth.userId });

    if (get(user, "name")) {
      return Users.update(args.auth);
    } else {
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
};

function getTimeStamp() {
  const date = new Date();
  return (timestamp = date.getTime());
}

async function SaveUserSettings(args, UserID) {
  let UserSettingsConstant = new UserSettings({
    userID: UserID,
    account: {
      name: args.Name,
      email: args.Email,
      userName: args.UserName,
    },
  });

  await UserSettingsConstant.save();
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
  if (get(args, "email") && get(args, "password")) {
    let valid = emailValidator.validate(args.email);
    if (valid) {
      let data = await Users.findOne({
        email: args.email,
        status: 1,
        isVerified: 1,
      });
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
      } else throw new Error("Email does not exists");
    }
  }
};
