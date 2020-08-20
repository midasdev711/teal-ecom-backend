const Users = require("../models/users");
const { GraphQLEmail } = require("graphql-custom-types");
const { ArticleStatusConst, RoleObject } = require("../constant");
const { generateToken, verifyToken } = require("../middleware/middleware");
const emailValidator = require("email-validator");
const uniqid = require("uniqid");
const { get } = require("lodash");
const sendMailToUser = require("../mail/signup");
const UserSettings = require("../../models/user_settings");
const passwordHash = require("password-hash");
const bcrypt = require("bcrypt");

module.exports = {
  index: async (root, args, context) => {
    console.log(args);
    const data = await userQuery({ args: args });

    // let data = await Users.find(findQuery);
    return data;
  },

  upsert: async (root, args, context) => {
    console.log(args);
    if (get(args.auth, "Name") && get(args.auth, "Email")) {
      args.auth.Description = args.auth.Name + "--" + args.auth.Email;
    }

    args.auth.UniqueID = uniqid();

    args.auth.RoleID = RoleObject.auth;

    if (get(args.auth, "Name"))
      args.auth.UserName = await generateUserName(args.auth.Name);

    if (get(args.auth, "SignUpMethod") && get(args.auth, "Password")) {
      args.auth.Password = passwordHash.generate(args.auth.Password);
    }

    let user = {};
    if (args.UserId) user = await Users.findOne({ ID: args.UserId });

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
      let APIKey = `Teal${uniqueId}${user._id}${timeStamp}${user.ID}`;
      const data = APIKey;
      APIKey = await bcrypt.hashSync(APIKey, 12);
      let user1 = await Users.findOneAndUpdate(
        { ID: args.UserID },
        { $set: { APIKey: APIKey } },
        { new: true }
      );
      console.log(user1);
      return data;
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
    UserID: UserID,
    Account: {
      Name: args.Name,
      Email: args.Email,
      UserName: args.UserName,
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
  if (get(args, "Email") && get(args, "Password")) {
    let valid = emailValidator.validate(args.Email);
    if (valid) {
      let data = await Users.findOne({
        Email: args.Email,
        Status: 1,
        isVerified: 1,
      });
      if (data) {
        if (passwordHash.verify(args.Password, data.Password)) {
          console.log(data, "data");
          return data ? await generateToken(data) : [];
        } else throw new Error("Password does not match");
      } else throw new Error("Email does not exists");
    }
  }
};
