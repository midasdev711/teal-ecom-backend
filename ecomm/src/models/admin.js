/*
 * Created By : Yashco System
 * Purpose : Created a graphQl modal
 */
//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const AdminSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    name: { type: String, required: true },
    email: {
      type: String,
      required: "email id is required",
      exists: false,
      unique: true,
    },
    password: { type: String },
    isActive: { type: Boolean, default: true },
    roleID: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

AdminSchema.plugin(autoIncrement.plugin, {
  model: "admins",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("admins", AdminSchema);
