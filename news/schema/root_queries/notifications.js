/*
  * Created By : Ankita Solace
  * Created Date : 15-12-2019
  * Purpose : Declare all Notifications schema methods
*/

const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt } = require('graphql'),
      Notifications = require('../../models/notifications'),
      { NotificationType } = require('../types/constant');


    // get users notifications
  const getUsersNotifications = {
    type: new GraphQLList(NotificationType),
      args: { RecieverID: { type: GraphQLInt } },
    resolve(parent, args) {
       return Notifications.find({ RecieverID: args.RecieverID, isView: false });
     }
  };

  module.exports = { getUsersNotifications };
