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
    BasicDetailsFullName: { type: String,  required: true, exists: false },
    BasicDetailsEmail: { type: String, unique : true },
    BasicDetailsMobile: { type: String },
    
    AddressDetailsAddress: { type: String },
    AddressDetailsApartment: { type: String },
    AddressDetailsCity: { type: String },
    AddressDetailsCountry: { type: String },
    AddressDetailsPostalCode: { type: String },
    AddressDetailsState: { type: String },

    CreatedDate: { type: Date, default: Date.now() },
    ModifiedDate: { type: Date, default: Date.now() },
});


CustomerSchema.plugin(autoIncrement.plugin, { model: 'customers', field: 'ID', startAt: 100 });
module.exports = mongoose.model('customers', CustomerSchema);
