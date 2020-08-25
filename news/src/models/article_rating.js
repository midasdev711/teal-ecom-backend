const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const ArticleRatingSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    description: String,
    userID: Number,
    clapCount: { type: Number, default: 0 },
    articleID: Number,
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

ArticleRatingSchema.plugin(autoIncrement.plugin, {
  model: "article_ratings",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("article_ratings", ArticleRatingSchema);
