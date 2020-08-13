/*
  * CreatedBy : Ankita Solace
  * Purporse : user wallet balance Schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      SchemaType = Schema.Types,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);

const UsersWalletSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    UserID :{  type: Number },
    Amount : { type : SchemaType.Decimal128, default : "0.00" },
    AmountType : { type : String, enum : ["Credit","Debit"], default : "Credit"},
    Purpose :{  type: String, enum : ["Donation","Subscription"] },
    RefrenceID :{  type: String },
    Currency : {  type: String, default : "USD" },
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});


UsersWalletSchema.plugin(autoIncrement.plugin, { model: 'users_wallet_balance', field: 'ID',startAt: 1 });
module.exports = mongoose.model('users_wallet_balance',UsersWalletSchema );
