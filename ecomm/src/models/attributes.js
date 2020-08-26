const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const AttributesSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    merchantId: { type: Number },
    attributeName: { type: String },
    attributeValues: [{ type: String }],
    productType: { type: String },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
AttributesSchema.plugin(autoIncrement.plugin, {
  model: "attributes",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("attributes", AttributesSchema);
