/*
 * CreatedBy : Ankita Solace
 * Purporse : user wallet balance Schema
 */
const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  SchemaType = Schema.Types,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const UsersWalletSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    userID: { type: Number },
    amount: { type: SchemaType.Decimal128, default: "0.00" },
    amountType: { type: String, enum: ["Credit", "Debit"], default: "Credit" },
    purpose: { type: String, enum: ["Donation", "Subscription"] },
    referenceID: { type: String },
    currency: { type: String, default: "USD" },
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

UsersWalletSchema.plugin(autoIncrement.plugin, {
  model: "users_wallet_balance",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("users_wallet_balance", UsersWalletSchema);
