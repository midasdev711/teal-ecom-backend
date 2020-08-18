/*
  * CreatedBy : Ankita Solace
  * Purporse : user selected category (not in use)Schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);

const UserCategorySchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    CategoryID :{  type: Array,  required: true },
    UserID :{  type: Number,  required: true },
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});


UserCategorySchema.plugin(autoIncrement.plugin, { model: 'user_categories', field: 'ID',startAt: 1 });
module.exports = mongoose.model('user_categories',UserCategorySchema );
