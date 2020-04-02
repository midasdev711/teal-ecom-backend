/*
  * Created By : Ankita Solace
  * Created Date : 15-12-2019
  * Purpose : Declare all Notifications schema methods
*/

const graphql = require('graphql');
const Notifications = require('../../models/notification');
const schemaArray = require('../types/constant');
const { NotificationType } = schemaArray;
const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt } = graphql;


  const getUsersNotifications = {
    type: new GraphQLList(NotificationType),
      args: { RecieverID: { type: GraphQLInt } },
    resolve(parent, args) {
       return Notifications.find({ RecieverID: args.RecieverID, isView: false });
     }
  };

  const NotificationArray = { getUsersNotifications };
  module.exports = NotificationArray;
