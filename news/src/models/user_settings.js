const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  SchemaType = Schema.Types,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const UserSettings = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    userID: Number,
    account: {
      name: String,
      email: {
        type: String,
        required: "email id is required",
        exists: false,
        unique: true,
      },
      userName: String,
      isFacebook: { type: Boolean, default: false },
    },
    notification: {
      trending: {
        isEmail: { type: Boolean, default: true },
        isPush: { type: Boolean, default: true },
        button: {
          isDaily: { type: Boolean, default: false },
          isWeekly: { type: Boolean, default: false },
          isOff: { type: Boolean, default: false },
        },
      },
      recommended: {
        isEmail: { type: Boolean, default: true },
        isPush: { type: Boolean, default: true },
        button: {
          isDaily: { type: Boolean, default: false },
          isWeekly: { type: Boolean, default: false },
          isOff: { type: Boolean, default: false },
        },
      },
      authorsLike: {
        isEmail: { type: Boolean, default: true },
        isPush: { type: Boolean, default: true },
        button: {
          isDaily: { type: Boolean, default: false },
          isWeekly: { type: Boolean, default: false },
          isOff: { type: Boolean, default: false },
        },
      },
      pagesLike: {
        isEmail: { type: Boolean, default: true },
        isPush: { type: Boolean, default: true },
        button: {
          isDaily: { type: Boolean, default: false },
          isWeekly: { type: Boolean, default: false },
          isOff: { type: Boolean, default: false },
        },
      },
      authorsFollow: {
        isEmail: { type: Boolean, default: true },
        isPush: { type: Boolean, default: true },
      },
      pagesFollow: {
        isEmail: { type: Boolean, default: true },
        isPush: { type: Boolean, default: true },
      },
      socialActivity: {
        isEmail: { type: Boolean, default: true },
        isPush: { type: Boolean, default: true },
      },
    },
    privacy: {
      isSocialStatShow: { type: Boolean, default: true },
      isCheeredPostShow: { type: Boolean, default: true },
    },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
    status: { type: Number, default: 1 },
    isPaidSubscription: { type: Boolean, default: false },
    paidSubscription: [
      {
        subscriptionID: { type: Number },
        name: { type: String },
        amount: { type: SchemaType.Decimal128, default: "0.00" },
        description: { type: String },
        days: { type: Number },
        status: { type: Number, default: 1 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSettings.plugin(autoIncrement.plugin, {
  model: "user_settings",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("user_settings", UserSettings);
