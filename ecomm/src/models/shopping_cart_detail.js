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

const ShoppingCartDetailSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    shoppingCartId: { type: Schema.Types.ObjectId, required: true },
    products: [
      {
        _id: { type: Schema.Types.ObjectId, required: true },
        productID: { type: Number },
        productTitle: String,
        productSKU: String,
        productMerchantID: Number,
        productSalePrice: { type: SchemaType.Decimal128 },
        productTotalQuantity: Number,
        productTotalPrice: Number,
        productVariantID: {
          type: Schema.Types.ObjectId,
          ref: "ProductVariant",
        },
      },
    ],
    totalCartItem: { type: Number, requied: true },
    itemTotalPrice: { type: SchemaType.Decimal128 },
    status: { type: Number, default: 1, requied: true },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
ShoppingCartDetailSchema.plugin(autoIncrement.plugin, {
  model: "shopping_cart_details",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model(
  "shopping_cart_details",
  ShoppingCartDetailSchema
);
