const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const ArticleClickDetailsSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    userID: Number,
    articleID: Number,
    visitedDate: { type: Date, default: Date.now() },
    status: { type: Number, default: 1 },
    articleTitle: { type: String },
    slug: { type: String },
  },
  {
    timestamps: true,
  }
);

ArticleClickDetailsSchema.plugin(autoIncrement.plugin, {
  model: "article_click_details",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model(
  "article_click_details",
  ArticleClickDetailsSchema
);
