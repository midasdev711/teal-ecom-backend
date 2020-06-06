/*
  * Created By : Yashco System
  * Purpose : Created a graphQl modal
*/
//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaType = Schema.Types;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const ShoppingCartDetailSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    ShoppingCartId :{type :Schema.Types.ObjectId , required: true},
    Products:[{
		_id: {type :Schema.Types.ObjectId , required: true},
        ProductID :  {type: Number },
        ProductTitle : String,
        ProductSKU : String,
        ProductMerchantID :Number,
        ProductSalePrice:{ type : SchemaType.Decimal128},
        ProductTotalQuantity : Number,
        ProductTotalPrice:Number,
        ProductVariantID: {type: Schema.Types.ObjectId , ref: 'ProductVariant'},
    }],
    TotalCartItem:{ type: Number ,requied :true },
    ItemTotalPrice : { type : SchemaType.Decimal128},
    Status : { type: Number, default: 1 ,requied :true },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});
ShoppingCartDetailSchema.plugin(autoIncrement.plugin, { model: 'shopping_cart_details', field: 'ID',startAt: 1 });
module.exports = mongoose.model('shopping_cart_details',ShoppingCartDetailSchema );
