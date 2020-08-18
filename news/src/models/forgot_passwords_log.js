/*
  * CreatedBy : Ankita Solace
  * Purporse :  forgot password log schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);

const ForgotPasswordSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    Email:  {  type: String },
    Subject:  {  type: String },
    UniqueLinkKey:  {  type: String },
    Description:  {  type: String },
    StartDate :  { type: Date, default: Date.now },
    ExpiryDate :  { type: Date, default: Date.now },
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now },
    CreatedBy: Number,
    ModifiedBy: Number
});

ForgotPasswordSchema.plugin(autoIncrement.plugin, { model: 'forgot_password_logs', field: 'ID',startAt: 1 });
module.exports = mongoose.model('forgot_password_logs',ForgotPasswordSchema );
