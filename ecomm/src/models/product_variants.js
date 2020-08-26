/*
 * Created By : Yashco System
 * Purpose : Created a graphQl modal
 */
//

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaType = Schema.Types;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const ProductVariantSchema = new Schema(
  {
    ID: { type: Number },
    productID: { type: Schema.Types.ObjectId, required: true },
    merchantID: { type: String, required: true },
    productVariants: [
      {
        name: { type: String },
        value: { type: String },
      },
    ],
    sellingPrice: { type: SchemaType.Decimal128 },
    costPrice: { type: SchemaType.Decimal128 },
    variantStock: { type: Number },
    variantSKU: { type: String },
    variantImage: { type: String },
    status: { type: Number, default: 1, requied: true },
    createdDate: { type: Date, default: Date.now() },
    modifiedDate: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

ProductVariantSchema.plugin(autoIncrement.plugin, {
  model: "product_variants",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model(
  "product_variants_masters",
  ProductVariantSchema
);
