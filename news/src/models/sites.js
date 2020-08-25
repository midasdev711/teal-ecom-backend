const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const UserSchema = new Schema(
  {
    ID: { type: Number, exists: false, unique: true },
    siteUrl: { type: String, unique: true, exists: false },
    authorID: { type: Number },
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(autoIncrement.plugin, {
  model: "parsing_sites",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("parsing_sites", UserSchema);
