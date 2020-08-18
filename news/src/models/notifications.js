/*
  * CreatedBy : Ankita Solace
  * Purporse :  notifications schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);

const NotificationSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    SenderID :Number,
    RecieverID :Number,
    Purpose: String,
    NotifyMessage: String,
    Subject: String,
    isView : { type: Boolean, default: false },
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now },
    CreatedBy: Number,
    ModifiedBy: Number
});

NotificationSchema.plugin(autoIncrement.plugin, { model: 'notifications', field: 'ID',startAt: 1 });
module.exports = mongoose.model('notifications',NotificationSchema );
