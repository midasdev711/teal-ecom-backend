/*
  * Created By : Yashco System
  * Purpose : Created a graphQl modal
*/
//

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const ProductAttributeSchema = new Schema({
    AttributeID : {  type: Number },
    AttributeName  : { type : String },
    AttributeCode  : { type : String },
    Status  : { type : Number, default : 1 },
    CreatedDate : {type : Date, default : Date.now() },
    ModifiedDate : {type : Date, default : Date.now() },
});



ProductAttributeSchema.plugin(autoIncrement.plugin, { model: 'product_attributes_master', field: 'AttributeID',startAt: 1 });
module.exports = mongoose.model('product_attributes_master',ProductAttributeSchema );



// Name
// attirbute Code
// Slug
// isConfigurable
//
//
// Size
//   unit Cm
//        Inch
//        Volume
//        Dimension
//        Liters
//        Kgs
//        Percentage
// Color
//   unit
//       Cloths
//
//
//
// Product type
//    isConfigurable
//     Taxes
//     Product Attribute
//     isShipable
//     ShipableUnit
//     isVariantAttribute
//
//
//   ProductTypeID : 1
//   Title : "Configurable"
//   isConfigurable : true
//   Taxes : []
//   isShipable : true
//   ShipableUnit : "Weight"
//   isVariantAttribute : true
//
//
//
// AttributeID : 1
// AttributeName : Size
// AttributeCode : size
// isParentAttribute : true
// ParentArrtibuteID : 0
// AttributeUnit : Size
//
//     AttributeID : 2
//     AttributeName : Volume
//     AttributeCode : volume
//     isParentAttribute : true
//     ParentArrtibuteID : 1
//     AttributeUnit : Volume
//
//             AttributeID : 4
//             AttributeName : 500ml
//             AttributeCode : 500ml
//             isParentAttribute : false
//             ParentArrtibuteID : 2
//             AttributeUnit : 500ml
//
//             AttributeID : 5
//             AttributeName : 750ml
//             AttributeCode : 750ml
//             isParentAttribute : false
//             ParentArrtibuteID : 2
//             AttributeUnit : 750ml
//
//             AttributeID : 6
//             AttributeName : 1l
//             AttributeCode : 1l
//             isParentAttribute : false
//             ParentArrtibuteID : 2
//             AttributeUnit : 1l
//
//     AttributeID : 3
//     AttributeName : Dimension
//     AttributeCode : dimension
//     isParentAttribute : true
//     ParentArrtibuteID : 1
//     AttributeUnit : Volume
//
//               AttributeID : 7
//               AttributeName : 10cm*10cm
//               AttributeCode : 10cm*10cm
//               isParentAttribute : false
//               ParentArrtibuteID : 3
//               AttributeUnit : 10cm*10cm
//
//               AttributeID : 8
//               AttributeName : 12cm*14cm
//               AttributeCode : 12cm*14cm
//               isParentAttribute : false
//               ParentArrtibuteID : 3
//               AttributeUnit : 12cm*14cm
//
//               AttributeID : 9
//               AttributeName : 14cm*19cm
//               AttributeCode : 14cm*19cm
//               isParentAttribute : false
//               ParentArrtibuteID : 3
//               AttributeUnit : 14cm*19cm
