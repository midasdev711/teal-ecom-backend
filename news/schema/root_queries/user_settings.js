/*
  * Created By : Ankita Solace
  * Created Date : 20-11-2019
  * Purpose : Declare all users settins schema methods
*/

const UserSettings = require('../../models/user_settings'),
      { UserSettingType } = require("../types/user_settings"),
      { GraphQLID,GraphQLInt,GraphQLList , GraphQLString, GraphQLBoolean } = require('graphql'),
      {  GraphQLEmail } = require('graphql-custom-types'),
      await = require('await');

// get user settings by id
  const GetUserSettingsByID = {
      type: new GraphQLList(UserSettingType),
      args: { UserID: { type: GraphQLInt } },
      resolve(parent, args) { return UserSettings.find({ UserID:args.UserID, Status : 1 }); }
  };

  module.exports = { GetUserSettingsByID };
