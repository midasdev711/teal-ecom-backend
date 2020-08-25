const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const RoleSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    name: { type: String, required: true, exists: false, unique: true },
    description: String,
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
    createdBy: Number,
    modifiedBy: Number,
  },
  {
    timestamps: true,
  }
);

RoleSchema.plugin(autoIncrement.plugin, {
  model: "roles",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("roles", RoleSchema);
