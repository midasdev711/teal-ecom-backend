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

const OrderSchema = new Schema(
  {
    ID: { type: Number, exists: false, unique: true },
    UserId: { type: Number },
    Status: { type: Number, default: 1 },
    Products: [
      {
        productID: { type: String, required: true },
        productSKU: { type: String },
        productMerchantID: { type: Number },
        productSalePrice: { type: String },
        productTitle: { type: String },
        productTotalQuantity: { type: Number },
        productTotalPrice: { type: String },
        productTitle: { type: String },
        status: { type: Number, default: 1 },
        productVariantID: { type: SchemaType.ObjectId, ref: "ProductVariant" },
      },
    ],
    OrderAmount: { type: String },
    ShippingAddress: {
      name: { type: String },
      email: { type: String },
      mobile: { type: String },
      postalCode: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      deliveryAddressType: { type: String },
    },
    DeliveryAddress: {
      name: { type: String },
      email: { type: String },
      mobile: { type: String },
      postalCode: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      deliveryAddressType: { type: String },
    },
    PaymentMethod: { type: String },
    transactionID: { type: String },
    createdDate: { type: Date, default: Date.now() },
    modifiedDate: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

OrderSchema.plugin(autoIncrement.plugin, {
  model: "orders",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("orders", OrderSchema);
