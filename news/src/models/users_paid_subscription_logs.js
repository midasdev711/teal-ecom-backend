const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  SchemaType = Schema.Types,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const UserPaidSubscriptionLogSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    userSubscriptionLogID: {
      type: Number,
      required: true,
      exists: false,
      unique: true,
    },
    userID: { type: Number },
    authorID: { type: Number },
    subscriptionID: { type: Number },
    subscriptionTitle: { type: String },
    days: { type: Number },
    userEmail: { type: String },
    amount: { type: SchemaType.Decimal128, default: "0.00" },
    amountType: { type: String, enum: ["Credit", "Debit"], default: "Credit" },
    purpose: { type: String, enum: ["Donation", "Subscription"] },
    TXNID: { type: String },
    currency: { type: String, default: "USD" },
    status: { type: Number, default: 1 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

UserPaidSubscriptionLogSchema.plugin(autoIncrement.plugin, {
  model: "users_paid_subscription_logs",
  field: "UserSubscriptionLogID",
  startAt: 1,
});
module.exports = mongoose.model(
  "users_paid_subscription_logs",
  UserPaidSubscriptionLogSchema
);
