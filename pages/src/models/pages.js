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

const PageSchema = new Schema({
    ID: { type: Number, required: true, exists: false, unique: true },
    PageTitle: { type: String,  required: true, exists: false },
    PageDescription: { type: String, required: true },
    PageCategory: { type: String, required: true },
    PageUserName: { type: String, required: true },
    PageEmail: { type: String },
    PagePhone: { type: String },
    PageWebsite: { type: String },
    PageLocation: { type: String },
    PageUserID: { type: Number },
    CreatedDate: { type: Date, default: Date.now() },
    ModifiedDate: { type: Date, default: Date.now() },
});

PageSchema.plugin(autoIncrement.plugin, { model: 'pages', field: 'ID', startAt: 100 });
module.exports = mongoose.model('pages', PageSchema);
