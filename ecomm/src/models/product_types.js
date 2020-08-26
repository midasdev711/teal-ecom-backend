/*
 * Created By : Yashco System
 * Purpose : Created a graphQl modal
 */
//

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const ProductTypeSchema = new Schema(
  {
    productTypeID: { type: Number },
    attributeID: { type: Number },
    featuredImage: { type: String },
    productTypeName: { type: String },
    productTypeCode: { type: String },
    productTypeUnit: { type: String },
    productTypeObject: [
      {
        _id: false,
        ID: { type: Number },
        name: { type: String },
      },
    ],
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now() },
    modifiedDate: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

ProductTypeSchema.plugin(autoIncrement.plugin, {
  model: "product_type_master",
  field: "ProductTypeID",
  startAt: 1,
});
module.exports = mongoose.model("product_type_master", ProductTypeSchema);
