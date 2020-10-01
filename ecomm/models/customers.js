/*
  * Created By : Ankita Solace
  * Created Date : 03-12-2019
  * Purpose :  create db product collection
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaType = Schema.Types;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const CustomerSchema = new Schema({
    ID: { type: Number, required: true, exists: false, unique: true },
    BasicDetails: {
        FirstName: { type: String,  required: true, exists: false },
        LastName: { type: String },
        Email: { type: String },
        Mobile: { type: String },
        EmailFlag: { type: String },
    },
    AddressDetails: {
        FirstName: { type: String },
        LastName: { type: String },
        Company: { type: String },
        Apartment: { type: String },
        City: { type: String },
        Country: { type: String },
        PostalCode: { type: String },
        Mobile: { type: String },
    },
    Tax: { type: Number },
    Notes: { type: String },
    Tags: { type: String },
    CreatedDate: { type: Date, default: Date.now() },
    ModifiedDate: { type: Date, default: Date.now() },
});


CustomerSchema.plugin(autoIncrement.plugin, { model: 'customers', field: 'ID', startAt: 100 });
module.exports = mongoose.model('customers', CustomerSchema);
