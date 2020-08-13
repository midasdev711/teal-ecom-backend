/*
  * CreatedBy : Ankita Solace
  * Purporse : subscrition list but currently not using Schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);

const SubscriptionSchema = new Schema({
    SubscriptionID: {  type: Number,  required: true, exists: false, unique : true },
    Name:  {  type: String,  required: true, exists: false, unique : true },
    Description:    {type: String},
    Days: {type: Number},
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now },
    CreatedBy: Number,
    ModifiedBy: Number
});

SubscriptionSchema.plugin(autoIncrement.plugin, { model: 'subscription_lists', field: 'SubscriptionID',startAt: 1 });
module.exports = mongoose.model('subscription_lists',SubscriptionSchema );
