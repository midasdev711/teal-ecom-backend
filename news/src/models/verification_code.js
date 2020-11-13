const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const VerificationSchema = new Schema(
  {
    email: {
      type: String,
      exists: false,
    },
    mobileNo: { type: String, exists: false },
    provider: {
      type: String,
      exists: false,
      enum: ["email", "mobile"],
    },
    code: {
      type: Number,
      exists: false,
      required: true,
    },
    expireDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("verification_code", VerificationSchema);
