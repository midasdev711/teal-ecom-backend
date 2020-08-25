const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const BlockAuthorSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    userID: { type: Number, required: true },
    authorID: { type: Number, required: true },
    isAuthorBlocked: { type: Boolean, default: false },
    status: { type: Number, default: 0 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

BlockAuthorSchema.plugin(autoIncrement.plugin, {
  model: "block_author",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("block_author", BlockAuthorSchema);
