const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  SchemaType = Schema.Types,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const UserSettings = new Schema({
  ID: { type: Number, required: true, exists: false, unique: true },
  userID: Number,
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
    isFollowersShow: { type: Boolean, default: true },
    isFollowingShow: { type: Boolean, default: true },
    isFollowButtonShow: { type: Boolean, default: true },
    isSocialLinksShow: { type: Boolean, default: true },
    isProfileBioShow: { type: Boolean, default: true },
  },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  status: { type: Number, default: 1 },
  isPaidSubscription: { type: Boolean, default: false },
  paidSubscription: [
    {
      subscriptionID: { type: Number },
    },
  ],
});

UserSettings.plugin(autoIncrement.plugin, {
  model: "user_settings",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("user_settings", UserSettings);
