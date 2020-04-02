/*
  * Created By : Yashco System
  * Purpose : Created a graphQl modal
*/
//

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const ProductTypeSchema = new Schema({
    ProductTypeID : {  type: Number },
    AttributeID : {  type: Number },
    FeaturedImage : { type : String },
    ProductTypeName  : { type : String },
    ProductTypeCode  : { type : String },
    ProductTypeUnit:  { type : String },
    ProductTypeObject : [{
          _id: false,
          ID : { type : Number },
          Name : { type : String },
     }],
    Status  : { type : Number, default : 1 },
    CreatedDate : {type : Date, default : Date.now() },
    ModifiedDate : {type : Date, default : Date.now() },
});



ProductTypeSchema.plugin(autoIncrement.plugin, { model: 'product_type_master', field: 'ProductTypeID',startAt: 1 });
module.exports = mongoose.model('product_type_master',ProductTypeSchema );
