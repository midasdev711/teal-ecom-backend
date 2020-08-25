const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const SubscriptionSchema = new Schema(
  {
    ID: { type: Number, exists: false, unique: true },
    subscriptionID: {
      type: Number,
      required: true,
      exists: false,
      unique: true,
    },
    name: { type: String, required: true, exists: false, unique: true },
    description: { type: String },
    days: { type: Number },
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

SubscriptionSchema.plugin(autoIncrement.plugin, {
  model: "subscription_lists",
  field: "SubscriptionID",
  startAt: 1,
});
module.exports = mongoose.model("subscription_lists", SubscriptionSchema);
