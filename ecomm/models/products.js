/*
  * Created By : Ankita Solace
  * Created Date : 03-12-2019
  * Purpose :  create db product collection
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaType = Schema.Types;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const ProductSchema = new Schema({
    ProductID : {  type: Number,  required: true, exists: false, unique : true },
    ProductMerchantID : {type : Number },
    ProductMerchantName : {type : String },
    ProductSKU : { type : String , default : ""},
    ProductTitle : { type : String,   exists: false, unique : true},
    ProductSlug : { type : String },
    ProductDescription : { type : String },
    ProductMRP : { type : SchemaType.Decimal128 },
    ProductSalePrice:{type: SchemaType.Decimal128 },
    ProductThumnailImage : { type : String , default : ""},
    ProductFeaturedImage : { type : String},
    ProductImages : [{ type : String }],
    ProductCategory : [{
        ID : {type : Number },
        Name : {type : String }
     }],
    ProductSubcategory : [{
      ID : {type : Number },
      Name : {type : String },
      ParentCategoryID : { type : Number }
    }],
    ProductSEO : {
        Title : {type : String },
        Description : {type : String },
        CronicalUrl : {type : String },
    },
   ProductAttributes :[{
     AttributsName :{type :String},
     AttributeValues :[{type :String}],
   }],
   AmpSlug : {type : String },
   ProductTotalQuantity : {type : Number },
   ProductStock : { type : Number, default : '' },
   ProductTermsAndConditions : {type : String },
   ProductTags : { type : Array },
   ProductStartDate : {type : Date , default : Date.now() },
   ProductEndDate : {type : Date , default : Date.now() },
   isPublish : { type : String },
   ProductSearchEngineTitle : { type : String },
   ProductSearchEngineDescription : {type : String },
   Status : { type : Number, default : 1 },
   CreatedBy : {type : Number },
   ModifiedBy : {type : Number },
   CreatedDate : {type : Date, default : Date.now() },
   ModifiedDate : {type : Date, default : Date.now() },
});


ProductSchema.plugin(autoIncrement.plugin, { model: 'products', field: 'ProductID',startAt: 100 });
module.exports = mongoose.model('products',ProductSchema );
