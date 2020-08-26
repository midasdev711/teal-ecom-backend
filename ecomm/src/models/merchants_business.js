/*
 * Created By : Yashco System
 * Purpose : Created a graphQl modal
 */
//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const MerchantBusinessSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    businessAddress: { type: String, required: true },
    businessCountry: { type: String, required: true },
    businessState: { type: String, required: true },
    businessCity: { type: String, required: true },
    businessPostalCode: { type: String, required: true },
    merchantId: { type: Schema.Types.ObjectId, ref: "merchants" },
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
MerchantBusinessSchema.plugin(autoIncrement.plugin, {
  model: "merchant_business",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("merchant_business", MerchantBusinessSchema);
