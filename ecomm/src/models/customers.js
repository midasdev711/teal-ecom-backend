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
    BasicDetailsFirstName: { type: String,  required: true, exists: false },
    BasicDetailsLastName: { type: String },
    BasicDetailsEmail: { type: String },
    BasicDetailsMobile: { type: String },
    BasicDetailsEmailFlag: { type: Boolean },

    
    AddressDetailsFirstName: { type: String },
    AddressDetailsLastName: { type: String },
    AddressDetailsCompany: { type: String },
    AddressDetailsApartment: { type: String },
    AddressDetailsCity: { type: String },
    AddressDetailsCountry: { type: String },
    AddressDetailsPostalCode: { type: String },
    AddressDetailsMobile: { type: String },

    Tax: { type: Number },
    Notes: { type: String },
    Tags: { type: String },
    CreatedDate: { type: Date, default: Date.now() },
    ModifiedDate: { type: Date, default: Date.now() },
});


CustomerSchema.plugin(autoIncrement.plugin, { model: 'customers', field: 'ID', startAt: 100 });
module.exports = mongoose.model('customers', CustomerSchema);
