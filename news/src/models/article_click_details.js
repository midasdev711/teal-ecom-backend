/*
  * CreatedBy : Ankita Solace
  * CreatedDate : 30-11-2019
  * Purporse :  article rating schema
*/

const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);


const ArticleClickDetailsSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    UserID : Number,
    ArticleID : Number,
    VisitedDate : { type : Date , default : Date.now() },
    Status : { type: Number, default: 1 },
    ArticleTitle : { type : String },
    Slug : { type : String }
});

ArticleClickDetailsSchema.plugin(autoIncrement.plugin, { model: 'article_click_details', field: 'ID',startAt: 1 });
module.exports = mongoose.model('article_click_details',ArticleClickDetailsSchema );
