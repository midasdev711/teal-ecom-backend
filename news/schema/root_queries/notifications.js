/*
  * Created By : Ankita Solace
  * Created Date : 15-12-2019
  * Purpose : Declare all Notifications schema methods
*/

const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt } = require('graphql'),
      Notifications = require('../../models/notifications'),
      { NotificationType } = require('../types/constant'),
      { verifyToken } = require('../middleware/middleware');

    // get users notifications
  const getUsersNotifications = {
    type: new GraphQLList(NotificationType),
      args: { RecieverID: { type: GraphQLInt } },
      resolve: async (parent, args, context) => {
        const id = await verifyToken(context);
        if(id.UserID) args.RecieverID = id.UserID
       return Notifications.find({ RecieverID: args.RecieverID, isView: false });
     }
  };

  module.exports = { getUsersNotifications };
