/*
  * Created By : Yashco System
  * Purpose : Created a graphQl modal
*/
//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const AdminSchema = new Schema({
  	ID: {  type: Number,  required: true, exists: false, unique : true },
    Name:  {  type: String,  required: true },
    Email:    {  type: String,  required: "email id is required", exists: false, unique : true },
    Password : { type: String },
    isActive:{type: Boolean, default: true},
    RoleID:{ type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});

AdminSchema.plugin(autoIncrement.plugin, { model: 'admins', field: 'ID',startAt: 1 });
module.exports = mongoose.model('admins',AdminSchema );
