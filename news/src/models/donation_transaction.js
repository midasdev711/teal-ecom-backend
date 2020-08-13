/*
  * CreatedBy : Ankita Solace
  * CreatedDate : 30-11-2019
  * Purporse :  Donation transction schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      SchemaType = Schema.Types,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);


const DonationTranscationSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    UserID :{  type: Number},
    Amount : { type : SchemaType.Decimal128, default : "0.00" },
    ArticleID :{  type: Number },
    ArticleTitle :{  type: String },
    AuthorID :{  type: Number },
    Purpose :{  type: String, enum : ["Donation"] },
    Currency : {  type: String, default : "USD" },
    TXNID :{  type: String },
    PaymentStatus :{ type: String },
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});


DonationTranscationSchema.plugin(autoIncrement.plugin, { model: 'donation_transaction_details', field: 'ID',startAt: 1 });
module.exports = mongoose.model('donation_transaction_details',DonationTranscationSchema );
