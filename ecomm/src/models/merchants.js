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
    name: { type: String, required: true },
    userName: { type: String, required: true },
    email: {
      type: String,
      required: "email id is required",
      exists: false,
      unique: true,
    },
    password: { type: String, requied: true },
    mobileNumber: { type: String, requied: true },
    merchatLogo: { type: String },
    roleID: { type: Number, default: 2 },
    isAdminApproved: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    status: { type: Number, default: 1, requied: true },
    verificationToken: { type: String },
    businessName: { type: String, requied: true },
    businessWebsite: { type: String, requied: true },
    businessRegistrationNumber: { type: String, requied: true },
    businessPhone: { type: String, requied: true },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
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
