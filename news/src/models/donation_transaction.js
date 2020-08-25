/*
 * CreatedBy : Ankita Solace
 * CreatedDate : 30-11-2019
 * Purporse :  Donation transction schema
 */
const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  SchemaType = Schema.Types,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const DonationTranscationSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    userID: { type: Number },
    amount: { type: SchemaType.Decimal128, default: "0.00" },
    articleID: { type: Number },
    articleTitle: { type: String },
    authorID: { type: Number },
    purpose: { type: String, enum: ["Donation"] },
    currency: { type: String, default: "USD" },
    TXNID: { type: String },
    paymentStatus: { type: String },
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

DonationTranscationSchema.plugin(autoIncrement.plugin, {
  model: "donation_transaction_details",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model(
  "donation_transaction_details",
  DonationTranscationSchema
);
