/*
  * Created By : Ankita Solace
  * Created Date : 16-12-2019
  * Purpose : Declare all notification schema methods
*/

const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean } = require('graphql'),
      Notification = require('../../models/notifications'),
      { NotificationType } = require('../types/constant'),
      { verifyToken } = require('../middleware/middleware');

  // add user notification
  const AddNotification = {
    type : NotificationType,
    args : {
      SenderID :{ type: GraphQLInt },
      RecieverID :{ type: GraphQLInt },
      Purpose : { type: GraphQLString },
      NotifyMessage : { type: GraphQLString },
      Subject : { type: GraphQLString },
      isView : { type: GraphQLBoolean }
    },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      if(id.UserID) args.SenderID = id.UserID
          let NotificationConstant = new Notification({
              SenderID :args.SenderID,
              RecieverID :args.RecieverID,
              Purpose : args.Purpose,
              Subject: args.Subject,
              NotifyMessage: args.NotifyMessage,
              isView: args.isView
          });
          return NotificationConstant.save();
    }
  };


  const NotificationArray = { AddNotification };
  module.exports = NotificationArray;
