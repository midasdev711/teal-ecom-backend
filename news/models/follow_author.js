/*
  * CreatedBy : Ankita Solace
  * Purporse :  follow author schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);

const AuthorFollowSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    AuthorID :{  type: Number,  required: true },
    UserID :{  type: Number,  required: true },
    isFollowed : {type : Boolean, default :false },
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});


AuthorFollowSchema.plugin(autoIncrement.plugin, { model: 'follow_authors', field: 'ID',startAt: 1 });
module.exports = mongoose.model('follow_authors',AuthorFollowSchema );
