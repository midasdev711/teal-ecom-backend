/*
  * CreatedBy : Ankita Solace
  * CreatedDate : 01-01-2020
  * Purporse :  email log schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);

const EmailLogSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    Email:  {  type: String },
    Subject:  {  type: String },
    UniqueLinkKey:  {  type: String },
    Description:  {  type: String },
    From  :  {  type: String },
    StartDate :  { type: Date, default: Date.now },
    EndDate :  { type: Date },
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now },
    CreatedBy: Number,
    ModifiedBy: Number
});

EmailLogSchema.plugin(autoIncrement.plugin, { model: 'email_logs', field: 'ID',startAt: 1 });
module.exports = mongoose.model('email_logs',EmailLogSchema );
