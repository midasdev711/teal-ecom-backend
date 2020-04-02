const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);


const ArticleRatingSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    Description:    String,
    UserID : Number,
    ClapCount:  { type: Number, default: 0 },
    UpVote :  { type: Number, default: 0 },
    DownVote: { type: Number, default: 0 },
    ArticleID : Number,
    Status : { type: Number, default: 1 }
});

ArticleRatingSchema.plugin(autoIncrement.plugin, { model: 'article_ratings', field: 'ID',startAt: 1 });
module.exports = mongoose.model('article_ratings',ArticleRatingSchema );
