/*
  * Created By : Yashco System
  * Purpose : Created a graphQl modal
*/
//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const ShoppingCartSchema = new Schema({
    ID: {  type: Number,  required: true, exists: false, unique : true },
    UserId :{ type: Schema.Types.ObjectId ,required: true  },
    OrderId: { type: String  },
    Status : { type: Number, default: 1 ,requied :true },
    CreatedDate:  { type: Date, default: Date.now },
    ModifiedDate:  { type: Date, default: Date.now }
});
ShoppingCartSchema.plugin(autoIncrement.plugin, { model: 'shopping_cart', field: 'ID',startAt: 1 });
module.exports = mongoose.model('shopping_cart',ShoppingCartSchema );
