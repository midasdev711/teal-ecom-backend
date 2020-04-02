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

const OrderSchema = new Schema({
    ID : {  type: Number,   exists: false, unique : true },
    UserId : {type : SchemaType.ObjectId},
    Status :  { type: Number, default: 1 },
    Products : [{
        ProductID : {  type: Number,  required: true },
        ProductSKU : { type : String},
        ProductMerchantID : { type : Number},
        ProductSalePrice : { type : SchemaType.Decimal128},
        ProductTitle : { type : String},
        ProductTotalQuantity : { type : Number},
        ProductTotalPrice : { type : SchemaType.Decimal128},
        ProductTitle : { type : String},
        Status :  { type: Number, default: 1 },
        ProductVariantID : { type : SchemaType.ObjectId , ref: 'ProductVariant'},
     }],
     OrderAmount : { type : SchemaType.Decimal128},
      ShippingAddress : {
        Name : {type : String },
        Email : {type : String },
        Mobile : {type : String },
        PostalCode : {type : String },
        Address : {type : String },
        City : {type : String },
        State : {type : String },
        DeliveryAddressType : {type : String },
      },
      DeliveryAddress  : {
        Name : {type : String },
        Email : {type : String },
        Mobile : {type : String },
        PostalCode : {type : String },
        Address : {type : String },
        City : {type : String },
        State : {type : String },
        DeliveryAddressType : {type : String },
      },
    PaymentMethod : {type : String },
    TransactionID : {type : String },
   CreatedDate : {type : Date, default : Date.now() },
   ModifiedDate : {type : Date, default : Date.now() },
});


OrderSchema.plugin(autoIncrement.plugin, { model: 'orders', field: 'ID',startAt: 1 });
module.exports = mongoose.model('orders',OrderSchema );
