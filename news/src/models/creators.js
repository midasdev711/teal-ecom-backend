/*
  * CreatedBy : Ankita Solace
  * CreatedDate : 30-11-2019
  * Purporse :  Creator schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);

const CreatorsSchema = new Schema({
    ID: {  type: Number,   exists: false, unique : true },
    Name:  {  type: String,  required: true },
    Description:    String,
    MobileNo : { type: Number },
    Email:    {  type: String,  required: "email id is required", exists: false, unique : true },
    UniqueID : {type : String, exists: false, unique : true },
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});


CreatorsSchema.plugin(autoIncrement.plugin, { model: 'creators', field: 'ID',startAt: 1 });
module.exports = mongoose.model('creators',CreatorsSchema );
