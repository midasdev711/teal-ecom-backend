const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const AttributesSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    MerchantId: { type: Number},
    AttributsName :{type :String},
    AttributeValues :[{type :String}],
    ProductType :{type :String },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});
AttributesSchema.plugin(autoIncrement.plugin, { model: 'attributes', field: 'ID',startAt: 1 });
module.exports = mongoose.model('attributes',AttributesSchema );  

