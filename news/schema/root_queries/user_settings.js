/*
  * Created By : Ankita Solace
  * Created Date : 20-11-2019
  * Purpose : Declare all users settins schema methods
*/

const UserSettings = require('../../models/user_settings'),
      Users = require('../../models/users'),
      { UserSettingType } = require("../types/user_settings"),
      { GraphQLID,GraphQLInt,GraphQLList , GraphQLString, GraphQLBoolean } = require('graphql'),
      {  GraphQLEmail } = require('graphql-custom-types'),
      await = require('await'),
      { verifyToken } = require('../middleware/middleware');

// get user settings by id
  const GetUserSettingsByID = {
      type: new GraphQLList(UserSettingType),
      args: {
        UserID: { type: GraphQLInt },
        UserName: { type: GraphQLString },
       },
       resolve: async (parent, args, context) => {
          const id = await verifyToken(context);
          if( id.UserID ) args.UserID = id.UserID
          let UserID = args.UserID
          if( typeof args.UserName != "undefined")
            UserID = await Users.findOne({ UserName : args.UserName},{ ID : true, _id : false})
            UserID = UserID.ID
          return UserSettings.find({ UserID:UserID, Status : 1 });
        }
  };

  module.exports = { GetUserSettingsByID };
