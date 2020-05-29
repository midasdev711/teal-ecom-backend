
const MerchantCatgory = require('../../models/merchants');
const MerchantBusinessCatgory = require('../../models/merchants_business');
const MerchantContactsCatgory = require('../../models/merchats_contacts');
const OrderSchema   = require('../../models/order');
const { OrderType } = require('../types/order_constant');

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
    * get Merchant list with search by keyword
    * @param {$Search} keyword
    * @returns {categorylist Array}
    */


const MerchantCategoryAll = {
  type: new GraphQLList(MerchantType),
  args: {
         Search: {type: GraphQLString },
    },
  resolve: async (parent, args, context) => {
     const id = await verifyToken(context);
     if(args.Search == undefined ){
        return MerchantCatgory.find({ Status: 1 }).sort({_id: -1});
     }else{
          return MerchantCatgory.find({ $or: [
                                              { Name:{$regex: args.Search },Status :1},
                                              { Email:{$regex: args.Search } ,Status :1 },
                                              { UserName:{$regex: args.Search } ,Status :1 }
                                             ]
                                    }).sort({_id: -1});
       }
    }
};


/**
    * get Merchant list with search by keyword and pagination
    * @param {$Search} keyword
    * @param {$limitl} limit
    * @param {$skip}  skip
    * @returns {merchantlist Array}
    */

const MerchantCategoryWithPagination = {
  type: new GraphQLList(MerchantType),
  args: {
         Limit: {type: GraphQLInt },
         Skip:  {type: GraphQLInt },
         Search: {type: GraphQLString }
      },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    const limit = args.Limit;
    const offset = limit * (args.Skip-1);
       if(limit == undefined){
          return MerchantCatgory.find({ Status: 1 }).sort({_id: -1});
       }else if (args.Search == undefined){
          return MerchantCatgory.find({ Status: 1 }).sort({_id: -1}).skip(offset).limit(limit);
       }else{
         return MerchantCatgory.find({ $or: [
                                             { Name:{$regex: args.Search },Status :1},
                                             { Email:{$regex: args.Search } ,Status :1 },
                                             { UserName:{$regex: args.Search } ,Status :1 }
                                            ]
                                   }).sort({_id: -1}).skip(offset).limit(limit);
       }
   }
};


/**
    * get Merchant details by id
    * @param {$id} _id
    * @returns {merchantdetails Array}
    */

const MerchantCategoryByID = {
  type: new GraphQLList(MerchantType),
  args: { _id: {type: GraphQLString } },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    return MerchantCatgory.find({ _id: args._id }); }
};


/**
    * get Merchant buseinss category by id
    * @param {$id} merchantID
    * @returns {merchantdetails Array}
    */

const MerchantBusinessCatgoryByID = {
  type: new GraphQLList(MerchantType),
  args: { MerchantId: {type: GraphQLString } },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    return MerchantBusinessCatgory.find({MerchantId: args.MerchantId }); }
};


/**
    * get Merchant contact category by id
    * @param {$id} merchantID
    * @returns {merchantdetails Array}
    */

const MerchantContactsCatgoryByID = {
  type: new GraphQLList(MerchantType),
  args: { MerchantId: {type: GraphQLString } },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    return MerchantContactsCatgory.find({MerchantId: args.MerchantId }); }
};



const MerchantArray = { MerchantCategoryAll,MerchantCategoryByID,MerchantCategoryWithPagination ,
   MerchantBusinessCatgoryByID,MerchantContactsCatgoryByID};

module.exports = MerchantArray;
