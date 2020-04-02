const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const RoleSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    Name:  {  type: String,  required: true, exists: false, unique : true },
    Description:    String,
    // AccessLevelID: Number, //foriegn key
    Status : { type: Number, default: 1 },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now },
    CreatedBy: Number,
    ModifiedBy: Number
});

RoleSchema.plugin(autoIncrement.plugin, { model: 'roles', field: 'ID',startAt: 1 });
module.exports = mongoose.model('roles',RoleSchema );
