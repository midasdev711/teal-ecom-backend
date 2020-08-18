/*
  * CreatedBy : Ankita Solace
  * CreatedDate : 30-11-2019
  * Purporse :  block author schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);

const BlockAuthorSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    UserID :{  type: Number,  required: true },
    AuthorID :{  type: Number,  required: true },
    isAuthorBlocked : { type: Boolean, default: false },
    Status : { type: Number, default: 0 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});


BlockAuthorSchema.plugin(autoIncrement.plugin, { model: 'block_author', field: 'ID',startAt: 1 });
module.exports = mongoose.model('block_author',BlockAuthorSchema );
