const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const BookMarkSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    articleID: { type: Number, required: true },
    userID: { type: Number, required: true },
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

BookMarkSchema.plugin(autoIncrement.plugin, {
  model: "article_bookmarks",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("article_bookmarks", BookMarkSchema);
