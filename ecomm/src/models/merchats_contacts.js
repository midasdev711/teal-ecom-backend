/*
 * Created By : Yashco System
 * Purpose : Created a graphQl modal
 */
//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const MerchantContactsSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    contactPersonName: { type: String },
    contactPersonEmail: { type: String },
    contactPersonPhone: { type: String },
    merchantId: { type: Schema.Types.ObjectId, ref: "merchants" },
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
MerchantContactsSchema.plugin(autoIncrement.plugin, {
  model: "merchant_contacts",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("merchant_contacts", MerchantContactsSchema);
