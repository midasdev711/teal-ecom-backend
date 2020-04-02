/*
  * Created By : Yashco System
  * Purpose : Created a graphQl modal
*/
//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const MerchantBusinessSchema = new Schema({
      ID: {  type: Number,  required: true, exists: false, unique : true },
      BusinessAddress :{type: String ,required: true},
      BusinessCountry :{type: String ,required: true },
      BusinessState :{type: String ,required: true },
      BusinessCity :{type: String ,required: true},
      BusinessPostalCode :{type: String ,required: true },
      MerchantId :{ type: Schema.Types.ObjectId ,ref: 'merchants' },
      Status : { type: Number, default: 1 },
      CreatedDate:  { type: Date, default: Date.now },
      ModifiedDate:  { type: Date, default: Date.now }
});
MerchantBusinessSchema.plugin(autoIncrement.plugin, { model: 'merchant_business', field: 'ID',startAt: 1 });
module.exports = mongoose.model('merchant_business',MerchantBusinessSchema );
