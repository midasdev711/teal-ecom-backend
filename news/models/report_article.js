/*
  * CreatedBy : Ankita Solace
  * Purporse :  Report Articles schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);

const ReportArticleSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    ArticleID :{  type: Number,  required: true },
    UserID :{  type: Number,  required: true },
    AuthorID :{  type: Number,  required: true },
    ReasonType : {
      type: String,
      required :true,
      enum : ["Spam","Harassment", "Rules Violation"]
    },
    isAuthorBlocked : { type: Boolean, default: false },
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});

ReportArticleSchema.plugin(autoIncrement.plugin, { model: 'report_article', field: 'ID',startAt: 1 });
module.exports = mongoose.model('report_article',ReportArticleSchema );
