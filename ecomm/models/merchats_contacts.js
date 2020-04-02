/*
  * Created By : Yashco System
  * Purpose : Created a graphQl modal
*/
//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const MerchantContactsSchema = new Schema({
      ID: {  type: Number,  required: true, exists: false, unique : true },
      ContactPersonName :{type: String },
      ContactPersonEmail :{type: String },
      ContactPersonPhone :{type: String },
      MerchantId :{type: Schema.Types.ObjectId ,ref: 'merchants' },
      Status : { type: Number, default: 1 },
      CreatedDate:  { type: Date, default: Date.now },
      ModifiedDate:  { type: Date, default: Date.now }
});
MerchantContactsSchema.plugin(autoIncrement.plugin, { model: 'merchant_contacts', field: 'ID',startAt: 1 });
module.exports = mongoose.model('merchant_contacts',MerchantContactsSchema );
