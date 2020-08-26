/*
 * Created By : Yashco System
 * Purpose : Created a graphQl modal
 */
//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const ShoppingCartSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    orderId: { type: String },
    status: { type: Number, default: 1, requied: true },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
ShoppingCartSchema.plugin(autoIncrement.plugin, {
  model: "shopping_cart",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("shopping_cart", ShoppingCartSchema);
