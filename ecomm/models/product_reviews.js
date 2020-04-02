/*
  * Created By : Yashco System
  * Purpose : Created a graphQl modal
*/
//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const ProductReviewSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    productId :{type: Schema.Types.ObjectId ,required : true},
    userId:{type: Schema.Types.ObjectId ,required : true },
    reviewDetails : {type: String , required : true },
    rating : {  type: String , required : true  ,default: 0 },
    isAdminApproved:{type: Boolean, default: false },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});
ProductReviewSchema.plugin(autoIncrement.plugin, { model: 'product_reviews', field: 'ID',startAt: 1 });
module.exports = mongoose.model('product_reviews',ProductReviewSchema );
