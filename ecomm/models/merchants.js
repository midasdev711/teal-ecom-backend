/*
  * Created By : Yashco System
  * Purpose : Created a graphQl modal
*/
//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const MerchantSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    Name: { type: String,  required: true },
    UserName :{type :String , required: true},
    Email: {  type: String,  required: "email id is required", exists: false, unique : true },
    Password : { type: String ,requied :true },
    MobileNumber:{type: String , requied :true },
    MerchatLogo : {type: String },
    RoleID:{ type: Number, default: 2 },
    isAdminApproved:{type: Boolean, default: false },
    isEmailVerified:{type: Boolean, default: false },
    Status : { type: Number, default: 1 ,requied :true },
    VerificationToken : {type: String },
    BusinessName :{type: String ,requied :true },
    BusinessWebsite :{type: String ,requied :true },
    BusinessRegistrationNumber :{type: String ,requied :true },
    BusinessPhone :{type: String ,requied :true  },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});
MerchantSchema.plugin(autoIncrement.plugin, { model: 'merchants', field: 'ID',startAt: 1 });
module.exports = mongoose.model('merchants',MerchantSchema );
