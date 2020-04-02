/*
  * Created By : Yashco System
  * Purpose : Created a graphQl modal
*/
//

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaType = Schema.Types;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const ProductVariantSchema = new Schema({
    ID : {  type: Number },
    ProductID : {type :Schema.Types.ObjectId, required: true },
    MerchantID : {type :String, required: true },
    ProductVariants : [{
        Name : { type : String },
        Value: {type : String }
     }],
    SellingPrice  : { type : SchemaType.Decimal128 },
    CostPrice  : { type : SchemaType.Decimal128 },
    VariantStock  : { type : Number },
    VariantSKU : { type : String  },
    VariantImage : { type : String  },
    Status : { type : Number ,default: 1 ,requied :true},
    CreatedDate : {type : Date, default : Date.now() },
    ModifiedDate : {type : Date, default : Date.now() },
});


ProductVariantSchema.plugin(autoIncrement.plugin, { model: 'product_variants', field: 'ID',startAt: 1 });
module.exports = mongoose.model('product_variants_masters',ProductVariantSchema );
