const ShoppingCartSchema = require('../../models/shopping_cart');
const ShoppingCartDetailSchema = require('../../models/shopping_cart_detail');
const ProductSchema = require('../../models/products');
const OrderSchema   = require('../../models/order');
const  UserSchema  = require('../../../news/models/users');
const Merchants = require('../../models/merchants');
const { MerchantType } = require('../types/merchant_constant');
const { ShoppingCartDetailsType } = require('../types/shopping_cart_details_constant');
const { ShoppingCartType } = require('../types/shopping_cart_constant');
const { OrderType } = require('../types/order_constant');
const { UserType } = require('../types/user_constant');
const ProductReview = require('../../models/product_reviews');
const { ProductReviewRatingType } = require('../types/product_review_constant');
const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean ,GraphQLError} = require('graphql');
const { GraphQLEmail } = require('graphql-custom-types');
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
const {BASE_URL ,EmailCredentials } = require("../../constant");
const { verifyToken } = require('../middleware/middleware');

/**
    * Adding Reviews & rating  to the product by user
    * @param {$productId} productId
    * @param {$userId}  userId
    * @param {$rating} rating
    * @param {$reviewDetails} reviewDetails
    * @returns {$cartDetails Array}
    */

const AddProductReviewRating = {
    type : ProductReviewRatingType,
    args : {
        productId :{type :GraphQLString },
        userId:{type: GraphQLString },
        rating : {type: GraphQLInt},
        reviewDetails : {type: GraphQLString },
    },
    resolve: async (parent, args, context) => {
           const id = await verifyToken(context);

           let ProductReviewConstant = new ProductReview({
                productId : args.productId,
                userId: args.userId,
                rating :args.rating,
                reviewDetails :args.reviewDetails,
           });

           let ReviewContact = await ProductReviewConstant.save();

           return ReviewContact;

      }
  };


  /**
      * Review Approval ByMerchant
      * @param {$_id} productId
      * @param {isAdminApproved}  userId
      * @returns {$productReview Array}
      */

    const MerchantReviewApproval = {
          type : ProductReviewRatingType,
          args : {
               _id : {type: GraphQLString },
               isAdminApproved :{type :GraphQLBoolean}
          },
          resolve: async (parent, args, context) => {
            const id = await verifyToken(context);
             const review_updates  = await  ProductReview.findOneAndUpdate(
                  { _id: args._id },
                  { $set: { isAdminApproved: args.isAdminApproved } },
                  {new: true}
              )
              return review_updates;
            }
        };


  const ReviewArray = { MerchantReviewApproval, AddProductReviewRating };
  module.exports = ReviewArray;
