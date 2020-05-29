
const ProductCatgory = require('../../models/products');
const { ProductType } = require('../types/product_constant');
const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt }= require('graphql');
const { verifyToken } = require('../middleware/middleware');


/**
    * get all product list
    * @param {$_id} productID
    * @returns {productDetails Array}
    */

const ProductCatgoryAll = {
  type: new GraphQLList(ProductType),
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    return ProductCatgory.find({}); }
};


/**
    * get Top three product list
    * @param {$_id} productID
    * @returns {productDetails Array}
    */

const TopProduct = {
  type: new GraphQLList(ProductType),
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    return ProductCatgory.find({}).sort({_id:1}).limit(3) }
};


/**
    * get Product details by _id
    * @param {$_id} _id
    * @returns {productDetails Array}
    */

  const ProductDetailsByID = {
    type: new GraphQLList(ProductType),
     args: { _id: {type: GraphQLString } },
     resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      return ProductCatgory.find({ _id: args._id }); }
  };


  /**
      * get Product details by ID
      * @param {$_id} productID
      * @returns {productDetails Array}
      */

  const GetProductDetailByProductID = {
    type : ProductType,
    args : { ProductID : { type: GraphQLString } },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
       return ProductCatgory.findOne({  _id : args.ProductID });
    }
  };


    /**
      * get Product list by category and subcategory
      * @param {$MainCategoryID} merchantID
      * @param {$SubCategoryID} keyword
      * @returns {productList Array}
      */

  const  ShopListByCategorySubCategory = {
      type : new GraphQLList(ProductType),
      args : {
        MainCategoryID : {type : GraphQLInt },
        SubCategoryID :  {type:GraphQLInt},
        SortField :{type:GraphQLString},
        Order :{type:GraphQLString}
      },
      resolve: async (parent, args, context) => {
         const id = await verifyToken(context);
         let shopList;
         let sortField = args.SortField;
         let order  =  args.Order;

          if(args.MainCategoryID === 0)
          {
             shopList = await ProductCatgory.find({}).sort({[sortField]: [order] });
          }
         else
         {
             if(args.SubCategoryID === 0)
             {
                shopList = await  ProductCatgory.aggregate([
                 { "$match": { 'ProductCategory.ID': args.MainCategoryID }},
                 { $sort: {
                      [sortField]: [order],
                  }
                }
               ]);
             }
             else
             {
               shopList = await  ProductCatgory.aggregate([
                { "$match": { 'ProductCategory.ID': args.MainCategoryID , 'ProductSubcategory.ID' : args. SubCategoryID}},
                { $sort: {
                     [sortField]: [order],
                 }
               }
              ]);
             }
         }
        return shopList
      }
  };


/**
    * get Product list by merchant id with search
    * @param {$MerchantID} merchantID
    * @param {$Search} keyword
    * @returns {productList Array}
    */

const MerchantProductList = {
        type: new GraphQLList(ProductType),
        args: {
               Search: {type: GraphQLString },
               MerchantID : {type :GraphQLInt}
          },
          resolve: async (parent, args, context) => {
           const id = await verifyToken(context);
           if(args.Search == undefined ){
              return ProductCatgory.find({ ProductMerchantID:args.MerchantID, Status: 1 }).sort({_id: -1});
           }else{
                return ProductCatgory.find({ $or: [
                                    { ProductTitle:{$regex: args.Search }, Status: 1 }
                                   ]
                      }).sort({_id: -1});
             }
          }
      };


const ProductArray = { ProductCatgoryAll , TopProduct , ProductDetailsByID ,
  ShopListByCategorySubCategory , MerchantProductList , GetProductDetailByProductID };

module.exports = ProductArray;
