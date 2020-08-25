/*
 * CreatedBy : Ankita Solace
 * CreatedDate : 01-01-2020
 * Purporse :  email log schema
 */
const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const EmailLogSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    email: { type: String },
    subject: { type: String },
    uniqueLinkKey: { type: String },
    description: { type: String },
    from: { type: String },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
    createdBy: Number,
    modifiedBy: Number,
  },
  {
    timestamps: true,
  }
);

EmailLogSchema.plugin(autoIncrement.plugin, {
  model: "email_logs",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("email_logs", EmailLogSchema);
