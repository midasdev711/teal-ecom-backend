const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaType = Schema.Types;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const StoreSchema = new Schema({
    ID: { type: Number, required: true, exists: false, unique: true },
    StoreTitle: { type: String,  required: true, exists: false },
    StoreDescription: { type: String, required: true },
    StoreCategory: { type: String, required: true },
    StoreUserName: { type: String, required: true },
    StoreEmail: { type: String },
    StorePhone: { type: String },
    StoreWebsite: { type: String },
    StoreLocation: { type: String },
    StoreUserID: { type: Number },
    StorePageID: { type: Number },
    CreatedDate: { type: Date, default: Date.now() },
    ModifiedDate: { type: Date, default: Date.now() },
});

StoreSchema.plugin(autoIncrement.plugin, { model: 'stores', field: 'ID', startAt: 100 });
module.exports = mongoose.model('stores', StoreSchema);
