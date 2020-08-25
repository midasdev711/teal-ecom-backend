const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const NotificationSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    senderID: Number,
    recieverID: Number,
    purpose: String,
    notifyMessage: String,
    subject: String,
    isView: { type: Boolean, default: false },
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

NotificationSchema.plugin(autoIncrement.plugin, {
  model: "notifications",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("notifications", NotificationSchema);
