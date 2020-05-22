/*
  * CreatedBy : Ankita Solace
  * Purporse : user paid subscrition log Schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      SchemaType = Schema.Types,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);

const UserSchema = new Schema({
    ID: {  type: Number,   exists: false, unique : true },
    Name:  {  type: String,  required: true },
    UserName : { type : String, exists : false, unique : true},
    Description:    String,
    Email:    {  type: String,  required: "email id is required", exists: false, unique : true },
    Password : { type: String },
    isVerified:{type: Boolean, default: true},
    SignUpMethod :{
          type: String,
          required :true,
          enum : ["Site","Facebook", "Google", "Mobile"],
          default : "Site"
   },
   MobileNo : { type: String,   exists: false, unique : true },
  RoleID: {type : Number},
  Dob :  { type: Date },
  Gender : {type : String
    // , enum : ["Male","Female", "Other"] 
  },
   ParentCategories : [{
     ID : Number,
     Name : String
   }],
   SubCategories : [
     {
       ID : Number,
       Name : String,
       ParentCategoryID : Number
     }
   ],
   Avatar :{ type: String, default: "" },
   UniqueID : {type : String, exists: false, unique : true },
   ReferenceID : {type : String},
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now },

    UserCounter  :{ type: Number, default: 1 },
     FaceBookUrl : { type : String, default : ""},
     TotalWalletAmount : { type : SchemaType.Decimal128, default : "0.00" },
     isPaidSubscription : { type : Boolean, default : false },
     PaidSubscription : [
       {
         SubscriptionID : { type : Number },
         Name : { type : String },
         Amount : { type : SchemaType.Decimal128, default : "0.00" },
         Description : { type : String },
         Days  : { type : Number },
         Status : { type : Number , default :  1}
       }
     ],
     IpAddress : { type : String }
});


//
UserSchema.plugin(autoIncrement.plugin, { model: 'users', field: 'ID',startAt: 1 });
module.exports = mongoose.model('users',UserSchema );
