const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  SchemaType = Schema.Types,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const UserSettings = new Schema({
  ID: { type: Number, required: true, exists: false, unique: true },
  UserID: Number,
  Account: {
    Name: String,
    Email: {
      type: String,
      required: "email id is required",
      exists: false,
      unique: true,
    },
    UserName: String,
    isFacebook: { type: Boolean, default: false },
  },
  Notification: {
    Trending: {
      isEmail: { type: Boolean, default: true },
      isPush: { type: Boolean, default: true },
      Button: {
        isDaily: { type: Boolean, default: false },
        isWeekly: { type: Boolean, default: false },
        isOff: { type: Boolean, default: false },
      },
    },
    Recommanded: {
      isEmail: { type: Boolean, default: true },
      isPush: { type: Boolean, default: true },
      Button: {
        isDaily: { type: Boolean, default: false },
        isWeekly: { type: Boolean, default: false },
        isOff: { type: Boolean, default: false },
      },
    },
    AuthorsLike: {
      isEmail: { type: Boolean, default: true },
      isPush: { type: Boolean, default: true },
      Button: {
        isDaily: { type: Boolean, default: false },
        isWeekly: { type: Boolean, default: false },
        isOff: { type: Boolean, default: false },
      },
    },
    PagesLike: {
      isEmail: { type: Boolean, default: true },
      isPush: { type: Boolean, default: true },
      Button: {
        isDaily: { type: Boolean, default: false },
        isWeekly: { type: Boolean, default: false },
        isOff: { type: Boolean, default: false },
      },
    },
    AuthorsFollow: {
      isEmail: { type: Boolean, default: true },
      isPush: { type: Boolean, default: true },
    },
    PagesFollow: {
      isEmail: { type: Boolean, default: true },
      isPush: { type: Boolean, default: true },
    },
    SocialActivity: {
      isEmail: { type: Boolean, default: true },
      isPush: { type: Boolean, default: true },
    },
  },
  Privacy: {
    isSocialStatShow: { type: Boolean, default: true },
    isCheeredPostShow: { type: Boolean, default: true },
  },
  CreatedDate: { type: Date, default: Date.now },
  ModifiedDate: { type: Date, default: Date.now },
  Status: { type: Number, default: 1 },
  isPaidSubscription: { type: Boolean, default: false },
  PaidSubscription: [
    {
      SubscriptionID: { type: Number },
      Name: { type: String },
      Amount: { type: SchemaType.Decimal128, default: "0.00" },
      Description: { type: String },
      Days: { type: Number },
      Status: { type: Number, default: 1 },
    },
  ],
});

UserSettings.plugin(autoIncrement.plugin, {
  model: "user_settings",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("user_settings", UserSettings);
