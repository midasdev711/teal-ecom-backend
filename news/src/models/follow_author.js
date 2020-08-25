const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const AuthorFollowSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    authorID: { type: Number, required: true },
    userID: { type: Number, required: true },
    isFollowed: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

AuthorFollowSchema.plugin(autoIncrement.plugin, {
  model: "follow_authors",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("follow_authors", AuthorFollowSchema);
