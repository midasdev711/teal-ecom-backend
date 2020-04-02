/*
  * Created By : Ankita Solace
  * Created Date : 16-12-2019
  * Purpose : Declare all notification schema methods
*/

const graphql = require('graphql');
const Notification = require('../../models/notification');
const { NotificationType } = require('../types/constant');
const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean } = graphql;

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
    resolve(parent, args) {
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
