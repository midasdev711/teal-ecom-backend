
const Attributes = require('../../models/attributes');
const { AttributesType } = require('../types/attributes_constant');
const { OrderStatusType } = require('../types/order_status.constant');
const { ProductReviewRatingType } = require('../types/product_review_constant');
const ProductReview = require('../../models/product_reviews');
const Users = require('../../../news/models/users');
const ProductCatgory = require('../../models/products');

const Products = require('../../models/products');
const { ProductType } = require('../types/product_constant');

const { MerchantType } = require('../types/merchant_constant');
const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt }= require('graphql');
const { GraphQLEmail } = require('graphql-custom-types');
const { verifyToken } = require('../middleware/middleware');


/**
    * get attributes list by keyword
    * @param {$Search} keyword
    * @returns {attributelist Array}
    */

 const ListAttribute = {
    type: new GraphQLList(AttributesType),
    args: {
           Search: {type: GraphQLString },
           TypeOfSerach: {type: GraphQLString },
           MerchantId : {type: GraphQLInt }
      },
    resolve: async (parent, args, context) => {
       const id = await verifyToken(context);
       if(args.TypeOfSerach == undefined ){
          return Attributes.find({ MerchantId: args.MerchantId }).sort({_id: -1});
       } else if(args.TypeOfSerach == "producttype"){
          return Attributes.find({ProductType:{$regex: args.Search },MerchantId: args.MerchantId}).sort({_id: -1});
       } else if(args.TypeOfSerach == "attributsname"){
          return Attributes.find({AttributsName:{$regex: args.Search },MerchantId: args.MerchantId}).sort({_id: -1});
       }  else {
          return Attributes.find({ $or: [
                { ProductType:{$regex: args.Search }, MerchantId: args.MerchantId },
                { AttributsName:{$regex: args.Search }, MerchantId: args.MerchantId }
                           ]
                }).sort({_id: -1});
         }
      }
  };



const AttributeArray = { ListAttribute };
module.exports = AttributeArray;
