const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      SchemaType = Schema.Types,
      autoIncrement = require('mongoose-auto-increment');
      autoIncrement.initialize(mongoose);
      mongoose.set('useFindAndModify', false);

const UserSchema = new Schema({
    ID: {  type: Number,   exists: false, unique : true },
    Name:  {  type: String,  required: true },
    Description:    String,
    Email:    {  type: String,  required: "email id is required", exists: false, unique : true },
    Password : { type: String },
    // UserRole :{
    //     RoleID: { type: Schema.Types.ObjectId, ref : UserAccessArea },
    // },
    // isSignup:{ type: Boolean, default: 0 },
    // isLogin:{ type: Boolean, default: 0 },
    UserCounter  :{ type: Number, default: 1 },
    isVerified:{type: Boolean, default: false},
    SignUpMethod :{ type: String, required: true },
    RoleID: Number,
    FaceBookUrl : { type : String, default : ""},
    Avatar : String,
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now },
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
});


//
UserSchema.plugin(autoIncrement.plugin, { model: 'users', field: 'ID',startAt: 1 });
module.exports = mongoose.model('users',UserSchema );
