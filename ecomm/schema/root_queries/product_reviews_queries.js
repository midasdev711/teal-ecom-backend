const { ProductReviewRatingType } = require('../types/product_review_constant');
const ShoppingCartSchema = require('../../models/shopping_cart');
const ShoppingCartDetailSchema = require('../../models/shopping_cart_detail');
const ProductReview = require('../../models/product_reviews');
const Users = require('../../../news/models/users');
const OrderSchema   = require('../../models/order');
const ProductCatgory = require('../../models/products');
const { ProductType } = require('../types/product_constant');
const { OrderType } = require('../types/order_constant');
const { UserType } = require('../../../news/schema/types/constant');
const { ShoppingCartDetailsType } = require('../types/shopping_cart_details_constant');
const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt }= require('graphql');
const { GraphQLEmail } = require('graphql-custom-types');
const { verifyToken } = require('../middleware/middleware');


/**
    * get all approved review list of a product
    * @param {productId} productID
    * @returns {reviewlist Array}
    */

const GetAllApproveReview = {
    type: new GraphQLList(ProductReviewRatingType),
    args: { productId: {type: GraphQLString } },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      const reviews = await ProductReview.find({ productId: args.productId , isAdminApproved : true});
        if(reviews.length > 0)
        {
          let getReviewDetails = (item,user_name) => {
              let itemDetails = {
                                 "rating": item.rating,
                                "isAdminApproved": item.isAdminApproved,
                                "_id": item._id,
                                "productId": item.productId,
                                "userId": item.userId,
                                "reviewDetails": item.reviewDetails,
                                "CreatedDate": item.CreatedDate,
                                "ModifiedDate": item.ModifiedDate,
                                "userName":user_name
                               };
              return itemDetails;
           };

            const promises = reviews.map(async review => {
                const userDetails = await Users.find({ _id: review.userId});
                 if(userDetails.length > 0 ){
                   let nemItem = await getReviewDetails(review,userDetails[0].Name) ;
                   return nemItem ;
                 }
                return true;
            });

         const allItemsList = await Promise.all(promises)
           return allItemsList;
        }
      else {
        return reviews;
      }
    }
  };


  /**
      * get all UNapproved review list
      * @returns {reviewlist Array}
      */

  const GetAllUnApproveReview = {
    type: new GraphQLList(ProductReviewRatingType),
    resolve: async (parent, args, context) => {
        const id = await verifyToken(context);
        const reviews = await ProductReview.find({ isAdminApproved : false });
          if(reviews.length > 0)
          {
            let getReviewDetails = (item,user_name,product_name) => {
                let itemDetails = {
                                   "rating": item.rating,
                                  "isAdminApproved": item.isAdminApproved,
                                  "_id": item._id,
                                  "productId": item.productId,
                                  "userId": item.userId,
                                  "reviewDetails": item.reviewDetails,
                                  "CreatedDate": item.CreatedDate,
                                  "ModifiedDate": item.ModifiedDate,
                                  "userName":user_name,
                                  "productName":product_name
                                 };
                return itemDetails;
             };

              const promises = reviews.map(async review => {
                  const userDetails = await Users.find({ _id: review.userId});
                   const productDetails = await ProductCatgory.find({ _id: review.productId});
                  let nemItem = await getReviewDetails(review,userDetails[0].Name,productDetails[0].title) ;
                  return nemItem ;
              });

           const allItemsList = await Promise.all(promises)
             return allItemsList;
          }
        else {
          return reviews;
        }
      }
  };



const ProductReviewsArray = { GetAllApproveReview , GetAllUnApproveReview  };
module.exports = ProductReviewsArray;
