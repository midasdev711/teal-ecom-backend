/*
 * Created By : Yashco System
 * Purpose : Created a graphQl modal
 */
//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const MerchantSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    merchantLogo: { type: String },
    isAdminApproved: { type: Boolean, default: false },
    verificationToken: { type: String },
    businessName: { type: String, requied: true },
    businessWebsite: { type: String, requied: true },
    businessRegistrationNumber: { type: String, requied: true },
    businessPhone: { type: String, requied: true },
    userID: { type: Schema.Types.ObjectId, ref: "users" },
  },
  {
    timestamps: true,
  }
);
MerchantSchema.plugin(autoIncrement.plugin, {
  model: "merchants",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("merchants", MerchantSchema);
