const { ProductReviewRatingType } = require('../types/product_review_constant');
const ShoppingCartSchema = require('../../models/shopping_cart');
const ShoppingCartDetailSchema = require('../../models/shopping_cart_detail');
const ProductReview = require('../../models/product_reviews');
const Users = require('../../../news/models/users');
const OrderSchema   = require('../../models/order');
const { OrderType } = require('../types/order_constant');
const { OrderStatusType } = require('../types/order_status.constant');
const { UserType } = require('../../../news/schema/types/constant');
const { ShoppingCartDetailsType } = require('../types/shopping_cart_details_constant');
const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt }= require('graphql');
const { GraphQLEmail } = require('graphql-custom-types');
const { verifyToken } = require('../middleware/middleware');

/**
    * get user shopping card details by userid
    * @param {$UserId} UserId
    * @returns {categorylist Array}
    */

 const GetUserShoppingCartDetailsByID = {
    type: new GraphQLList(ShoppingCartDetailsType),
    args: { UserId: {type: GraphQLString } },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);

      let userShoppingCard = await ShoppingCartSchema.find({ UserId: args.UserId ,OrderId : null });

      let card_data = [] ;
      
       if(userShoppingCard.length > 0)
       {
         let shoppingCardDetails = await ShoppingCartDetailSchema.find({ ShoppingCartId: userShoppingCard[0]._id });
          
         card_data = shoppingCardDetails;
         
       }

       return card_data;
    }
  };


  /**
      * get order details by order id
      * @param {$OrderId} OrderId
      * @returns {categorylist Array}
      */

const GetOrderDetailsByID = {
    type: new GraphQLList(OrderType),
    args: { OrderId: {type: GraphQLString } },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);

      const orderDetails = await OrderSchema.find({ _id : args.OrderId ,Status : 1});

       return orderDetails;
    }
  };


  /**
      * get order details by user id
      * @param {$UserId} UserId
      * @returns {categorylist Array}
      */

const GetOrderDetailsByUserID = {
    type: new GraphQLList(OrderType),
    args: { UserId: {type: GraphQLString } },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);

      const orderDetails = await OrderSchema.find({ UserId : args.UserId ,Status : 1 });

       return orderDetails;
    }
  };


/**
    * get order details by  shopping cartid
    * @param {$UserId} UserId
    * @returns {categorylist Array}
    */

  const GetUserShoppingCartDetailsByShoppingCardID = {
      type: new GraphQLList(ShoppingCartDetailsType),
      args: { ShoppingCartId: {type: GraphQLString } },
      resolve: async (parent, args, context) => {
        const id = await verifyToken(context);
        const shoppingCardDetails = await ShoppingCartDetailSchema.find({ ShoppingCartId: args.ShoppingCartId });

        return shoppingCardDetails;
      }
    };




      /**
          * get all active order list by merchant id
            * @param {merchantID} merchantid
          * @returns {reviewlist Array}
          */


      const MerchantActiveOrderList = {
          type : new GraphQLList(OrderStatusType),
          args : {
              MerchantID : {type: GraphQLInt },
          },
          resolve: async (parent, args, context) => {
            const id = await verifyToken(context);

              const order_List  =  await OrderSchema.aggregate([
                     { $match : { "Products.ProductMerchantID":  args.MerchantID,"Products.Status" : 1 } },
                     { $unwind : { path : "$Products", includeArrayIndex: 'true' } },
                     { $match : { "Products.ProductMerchantID": args.MerchantID ,"Products.Status" : 1 } }
                   ]);
                return order_List;
            }
        };



      /**
          * get all cancelled order list by merchant id
            * @param {merchantID} merchantid
          * @returns {reviewlist Array}
          */


      const MerchantCancelledOrderList = {
        type : new GraphQLList(OrderStatusType),
        args : {
            MerchantID : {type: GraphQLInt },
        },
        resolve: async (parent, args, context) => {
          const id = await verifyToken(context);

          const order_List  =  await OrderSchema.aggregate([
                 { $match : { "Products.ProductMerchantID": args.MerchantID,"Products.Status" : 0 } },
                 { $unwind : { path : "$Products", includeArrayIndex: 'true' } },
                 { $match : { "Products.ProductMerchantID": args.MerchantID ,"Products.Status" : 0 } }
               ]);

            return order_List;
          }
      };



      /**
          * get recent order list
            * @param {merchantID} merchantid
          * @returns {orderlist Array}
          */

      const LastOrderActivity = {
      type: new GraphQLList(OrderType),
      resolve: async (parent, args, context) => {
        const id = await verifyToken(context);
        return OrderSchema.find({}).sort({_id:-1}).limit(10) }
    };


    // get all products
    const DisplayOrderListToAdmin = {
        type : new  GraphQLList(OrderType),
        resolve: async (parent, args, context) => {
          const id = await verifyToken(context);
          return OrderSchema.find({}).sort({_id:-1})
        }
    };


    // get all products
    const DisplayOrderListToMerchant = {
        type : new  GraphQLList(OrderType),
        args : {
          ProductMerchantID : {type : GraphQLString }
        },
        resolve: async (parent, args, context) => {
          const id = await verifyToken(context);

          return Orders.aggregate([
            { "$match": { 'Products.ProductMerchantID': args.ProductMerchantID }},
            {
              "$project" : {
                  "Products" : {
                     "$filter" : {
                        "input" : "$Products",
                        "as" : "item",
                         "cond": { "$eq": ['$$item.ProductMerchantID', args.ProductMerchantID ] }
                     }
                  }
              }
            },
          ])
        }
    };


    // get all products
    const DisplayOrderListToUsers = {
        type : new  GraphQLList(OrderType),
        args : {
          UserID : { type : GraphQLString }
        },
        resolve: async (parent, args, context) => {
          const id = await verifyToken(context);
            return Orders.find( { UserId : args.UserID } )
        }
    }

const OrderArray = { GetUserShoppingCartDetailsByID ,GetOrderDetailsByID ,
  GetOrderDetailsByUserID ,GetUserShoppingCartDetailsByShoppingCardID ,
MerchantCancelledOrderList , MerchantActiveOrderList , LastOrderActivity , DisplayOrderListToAdmin };

module.exports = OrderArray;
