/*
 * CreatedBy : Ankita Solace
 * Purporse : user paid subscrition log Schema
 */
const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const APIKeySchema = new Schema(
  {
    ID: { type: Number, exists: false, unique: true },
    UserID: { type: Number },
    user_id: { type: Schema.Types.ObjectId, ref: "users" },
    APIKey: { type: String },
    expirationTime: { type: Date },
    isExpired: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

//
APIKeySchema.plugin(autoIncrement.plugin, {
  model: "apiKey",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("apiKey", APIKeySchema);