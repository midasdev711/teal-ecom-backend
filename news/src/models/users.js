/*
 * CreatedBy : Ankita Solace
 * Purporse : user paid subscrition log Schema
 */
const mongoose = require("mongoose"),   
  Schema = mongoose.Schema,
  SchemaType = Schema.Types,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const UserSchema = new Schema(
  {
    ID: { type: Number, exists: false, unique: true },
    name: { type: String, required: true },
    userName: { type: String, exists: false, unique: true },
    description: String,
    email: {
      type: String,
      exists: false,
    },
    password: { type: String },
    isVerified: { type: Boolean, default: true },
    signUpMethod: {
      type: String,
      required: true,
      enum: ["Site", "Facebook", "Google", "Mobile"],
      default: "Site",
    },
    mobileNo: { type: String, exists: false },
    roleID: { type: Number },
    dob: { type: Date },
    gender: {
      type: String,
      // , enum : ["Male","Female", "Other"]
    },
    parentCategories: [
      {
        ID: Number,
        name: String,
        categoryType: { type: Number, default: 1 },
      },
    ],
    subCategories: [
      {
        ID: Number,
        name: String,
        parentCategoryID: Number,
        categoryType: { type: Number, default: 0 },
      },
    ],
    avatar: { type: String, default: "" },
    uniqueID: { type: String, exists: false, unique: true },
    referenceID: { type: String },
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },

    userCounter: { type: Number, default: 1 },
    faceBookUrl: { type: String, default: "" },
    totalWalletAmount: { type: String, default: "0.00" },
    isPaidSubscription: { type: Boolean, default: false },
    paidSubscription: [
      {
        subscriptionID: { type: Number },
        name: { type: String },
        amount: { type: String, default: "0.00" },
        description: { type: String },
        days: { type: Number },
        status: { type: Number, default: 1 },
      },
    ],
    ipAddress: { type: String },
  },
  {
    timestamps: true,
  }
);

//
UserSchema.plugin(autoIncrement.plugin, {
  model: "users",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("users", UserSchema);
