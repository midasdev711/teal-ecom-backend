/**
 * @description - Mongoose Schema for ads campaign
 */

const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const adCampaignSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    articleId: { type: Number, required: true },
    campaignName: { type: String, required: true },
    totalHits: { type: Number },
    humanHits: { type: Number },
  },
  { timestamps: true }
);

adCampaignSchema.plugin(autoIncrement.plugin, {
  model: "ad_campaign",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("ad_campaign", adCampaignSchema);
