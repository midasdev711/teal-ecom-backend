const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const CreatorsSchema = new Schema(
  {
    ID: { type: Number, exists: false, unique: true },
    name: { type: String, required: true },
    description: String,
    mobileNo: { type: Number },
    email: {
      type: String,
      required: "email id is required",
      exists: false,
      unique: true,
    },
    uniqueID: { type: String, exists: false, unique: true },
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

CreatorsSchema.plugin(autoIncrement.plugin, {
  model: "creators",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("creators", CreatorsSchema);
