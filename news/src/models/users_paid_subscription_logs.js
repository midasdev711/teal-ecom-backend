/*
  * CreatedBy : Ankita Solace
  * Purporse : user paid subscrition log Schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      SchemaType = Schema.Types,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);


const UserPaidSubscriptionLogSchema = new Schema({
    UserSubscriptionLogID: {  type: Number,  required: true, exists: false, unique : true },
    UserID :{  type: Number },
    AuthorID :{  type: Number },
    SubscriptionID :{  type: Number },
    SubscriptionTitle : {  type: String },
    Days : {  type: Number },
    UserEmail : {type : String },
    Amount : { type : SchemaType.Decimal128, default : "0.00" },
    AmountType : { type : String, enum : ["Credit","Debit"], default : "Credit"},
    Purpose :{  type: String, enum : ["Donation","Subscription"] },
    TXNID :{  type: String },
    Currency : {  type: String, default : "USD" },
    Status : { type: Number, default: 1 },
    StartDate:  { type: Date, default: Date.now },
    EndDate:  { type: Date, default: Date.now },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});


UserPaidSubscriptionLogSchema.plugin(autoIncrement.plugin, { model: 'users_paid_subscription_logs', field: 'UserSubscriptionLogID',startAt: 1 });
module.exports = mongoose.model('users_paid_subscription_logs',UserPaidSubscriptionLogSchema );
