const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const BookMarkSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    ArticleID :{  type: Number,  required: true },
    UserID :{  type: Number,  required: true },
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});


BookMarkSchema.plugin(autoIncrement.plugin, { model: 'article_bookmarks', field: 'ID',startAt: 1 });
module.exports = mongoose.model('article_bookmarks',BookMarkSchema );
