const Users = require("../models/users");
const { get } = require("lodash");
const UserSettings = require("../models/user_settings");
const passwordHash = require("password-hash");

module.exports = {
  index: async (root, args, context) => {
    let settingsData = await UserSettings.findOne({
      userID: args.userId,
      status: 1,
    });
    console.log(settingsData);
    let data = await Users.findOne({ ID: args.userId, status: 1 });
    settingsData["account"] = data;
    return settingsData;
  },

  upsert: async (root, args, context) => {
    console.log("asdasd", args);

    if (get(args.userSetting, "account")) {
      let accountData = args.userSetting.account;
      if (get(accountData, "userName")) {
        let userData = await Users.findOne({
          userName: accountData.userName,
          status: 1,
        });
        if (userData) {
          throw "UserName already exist";
        }
      }
      if (get(accountData, "email")) {
        let userData = await Users.findOne({
          email: accountData.email,
          status: 1,
        });
        if (userData) {
          throw "Email already exist";
        }
      }
      if (get(accountData, "oldPassword") && get(accountData, "newPassword")) {
        let userData = await Users.findOne({
          ID: args.userSetting.userId,
          status: 1,
        });
        if (userData) {
          console.log("accountData", accountData, userData);
          console.log(
            passwordHash.verify(accountData.oldPassword, userData.password)
          );
          if (passwordHash.verify(accountData.oldPassword, userData.password)) {
            accountData.password = passwordHash.generate(
              accountData.newPassword
            );
            console.log("accountData", accountData);
          } else {
            throw "Old password is not correct";
          }
        }
      }

      await Users.findOneAndUpdate(
        { ID: args.userSetting.userId, status: 1 },
        accountData,
        { new: true }
      );
    }

    let settingsData = await UserSettings.findOneAndUpdate(
      { userID: args.userSetting.userId, status: 1 },
      { $set: args.userSetting },
      { new: true }
    );

    console.log(settingsData);
    let data = await Users.findOne({ ID: args.userSetting.userId, status: 1 });

    settingsData["account"] = data;

    return settingsData;
  },
};
