const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const ForgotPasswordSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    email: { type: String },
    subject: { type: String },
    uniqueLinkKey: { type: String },
    description: { type: String },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, default: Date.now },
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
    createdBy: Number,
    modifiedBy: Number,
  },
  {
    timestamps: true,
  }
);

ForgotPasswordSchema.plugin(autoIncrement.plugin, {
  model: "forgot_password_logs",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("forgot_password_logs", ForgotPasswordSchema);
