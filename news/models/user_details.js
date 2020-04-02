const mongoose = require("mongoose");
const UserSchema = require('../models/users');

const Schema = mongoose.Schema;

const UserDetailSchema = new Schema({
        ID: Number,
        Email:    String,
        MobileNumber: { type: Number, min: 10, max: 13 },
        UserImage : { type: String },
        Users :{
            UserID: { type: Schema.Types.ID, ref : UserSchema },
        },
        Status : Boolean,
        CreatedDate:  { type: Date, default: Date.now },
        ModifiedDate:  { type: Date, default: Date.now },
});

module.exports = mongoose.model('users',UserDetailSchema );
