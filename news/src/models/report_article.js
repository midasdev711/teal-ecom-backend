const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const ReportArticleSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    articleID: { type: Number, required: true },
    userID: { type: Number, required: true },
    authorID: { type: Number, required: true },
    reasonType: {
      type: String,
      required: true,
      enum: ["spam", "harassment", "rules violation"],
    },
    isAuthorBlocked: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

ReportArticleSchema.plugin(autoIncrement.plugin, {
  model: "report_article",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("report_article", ReportArticleSchema);
