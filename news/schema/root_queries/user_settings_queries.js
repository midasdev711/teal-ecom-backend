/*
  * Created By : Ankita Solace
  * Created Date : 20-11-2019
  * Purpose : Declare all users settins schema methods
*/

const UserSettings = require('../../models/user_settings');
const { UserSettingType } = require('../types/constant');
const { GraphQLID,GraphQLInt,GraphQLList , GraphQLString, GraphQLBoolean } = require('graphql');
const {  GraphQLEmail } = require('graphql-custom-types');
var await = require('await');

  const GetUserSettingsByID = {
      type: new GraphQLList(UserSettingType),
      args: { UserID: { type: GraphQLInt } },
      resolve(parent, args) { return UserSettings.find({ UserID:args.UserID, Status : 1 }); }
  };

  const UserSettingsArray = { GetUserSettingsByID };
  module.exports = UserSettingsArray;
