/*
  * CreatedBy : Ankita Solace
  * Purporse : site Schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);

const UserSchema = new Schema({
    ID: {  type: Number,   exists: false, unique : true },
    SiteUrl : {type : String, unique:true, exists: false},
    AuthorID : {  type: Number },
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});


UserSchema.plugin(autoIncrement.plugin, { model: 'parsing_sites', field: 'ID',startAt: 1 });
module.exports = mongoose.model('parsing_sites',UserSchema );
