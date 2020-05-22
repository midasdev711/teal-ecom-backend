/*
  * CreatedBy : Ankita Solace
  * CreatedDate : 30-11-2019
  * Purporse :  Categories schema
*/
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment');
			autoIncrement.initialize(mongoose);

const CategoriesSchema = new Schema({
	ID: {  type: Number,  required: true, exists: false, unique : true },
	Name : {  type: String,  required: true , exists: false, unique : true},
	Description : String,
	Sequence : Number,
	FeatureImage : String,
	Slug : {  type: String,  required: true, exists: false, unique : true },
	isParent : Boolean,
	ParentCategoryID : {  type: Number,  required: true, default: 0 },
	Status :  { type: Number, default: 1 },
	CreatedDate:  { type: Date, default: Date.now },
	ModifiedDate:  { type: Date, default: Date.now },
	CreatedBy: { type: Number, default: 1 },
	ModifiedBy: { type: Number, default: 1 }
});

CategoriesSchema.plugin(autoIncrement.plugin, { model: 'categories', field: 'ID',startAt: 1 });
CategoriesSchema.plugin(autoIncrement.plugin, { model: 'categories', field: 'Sequence',startAt: 1 });
module.exports = mongoose.model('categories',CategoriesSchema );
