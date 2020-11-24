/*
  * Created By : Ankita Solace
  * Created Date : 03-12-2019
  * Purpose :  create db blog collection
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaType = Schema.Types;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const BlogSchema = new Schema({
    ID: { type: Number, required: true, exists: false, unique: true },
    BlogTitle: { type: String,  required: true, exists: false },
    BlogPublishingPlace: { type: String },
    BlogCategory: { type: String },
    BlogPicture: { type: String },
    BlogUserID: { type: Number },
    BlogPageID: { type: String },
    CreatedDate: { type: Date, default: Date.now() },
    ModifiedDate: { type: Date, default: Date.now() },
});


BlogSchema.plugin(autoIncrement.plugin, { model: 'blogs', field: 'ID', startAt: 100 });
module.exports = mongoose.model('blogs', BlogSchema);
