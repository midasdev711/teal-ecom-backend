/*
  * Created By : Yashco Systems
  * Purpose : all root mutations
*/

const { GraphQLObjectType } = require('graphql');

const { AdminCategorySignIn } = require('../root_mutation/admin_mutations');

const { AddAttributes,RemoveAttributes } = require('../root_mutation/attribute_mutations');

const { AddProductVariant , RemoveProductVariant} = require('../root_mutation/variant_mutations');

const { AddProductCategorySubcategory , UpdateProductCategorySubcategory ,
  RemoveProductCategorySubcategory } = require('../root_mutation/category_mutations');

const { AddMerchantCategory, DeleteMerchantCategoryByID ,
        UpdateMerchantCategory ,MerchantCategorySignIn ,
        MerchantEmailVerification ,MerchantAdminApproval ,
      } = require('../root_mutation/merchant_mutations');

const { UserSignIn , MerchantForgotPassword ,
        MerchantPasswordReset } = require('../root_mutation/merchant_user_mutations');

const { CancelOrderByMerchant,PlaceOrderMutation ,
        PaymentMethodMutation , CreateShoppingCart ,
        UpdateShoppingCart ,CancelOrderByUser ,
        CancelWholeOrderByUser
      } = require('../root_mutation/order_mutations');

const { CreateProductsDetailByMerchant , UpdateProductDetail } = require('../root_mutation/product_mutations');

const { MerchantReviewApproval, AddProductReviewRating } = require('../root_mutation/product_reviews_mutations');

const { UserSignUp , UpdateUserDetail } = require('../root_mutation/user_mutations');


const { AddCustomer  } = require('../root_mutation/customer_mutations'),

// declared a mutation constant
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        /* ------------------------------------Admin Mutation-------------------------------- */

             adminSignIn : AdminCategorySignIn,

        /* ------------------------------------variant Mutation------------------------------ */

                  addVariantToProduct:AddProductVariant,   
                  removeVariantToProduct:RemoveProductVariant, 

        /* ------------------------------------Attribute Mutation------------------------------ */

              addAttributes : AddAttributes,
              removeAttributes : RemoveAttributes,

        /* ------------------------------------Category Mutation---------------------------- */

              AddProductCategory :AddProductCategorySubcategory,
              UpdateProductCategory:UpdateProductCategorySubcategory,
              RemoveProductCategory:RemoveProductCategorySubcategory,

        /* ------------------------------------Merchant Mutation---------------------------------- */

              merchantSignup : AddMerchantCategory,
              deleteMerchantCategoryByID:DeleteMerchantCategoryByID,
              updateMerchant : UpdateMerchantCategory,
              merchantSignin : MerchantCategorySignIn ,
              merchantEmailVerification:MerchantEmailVerification,
              merchantAdminApproval:MerchantAdminApproval,

       /* ------------------------------------Merchant User Mutation--------------------------- */

             merchantForgotPassword :MerchantForgotPassword,
             merchantPasswordReset:MerchantPasswordReset,
             UserSignUp : UserSignUp,

        /* ------------------------------------Order Mutation--------------------------------------*/

                   cancelOrderByMerchantMutation:CancelOrderByMerchant,
                   placeOrderMutation:PlaceOrderMutation ,
                   AddPaymentMethodMutation:PaymentMethodMutation,
                   CreateShoppingCartMutation : CreateShoppingCart ,
                   UpdateShoppingCartMutation : UpdateShoppingCart ,
                   cancelOrderByUserIDMutation:CancelOrderByUser,
                   cancelWholeOrderByUserIDMutation : CancelWholeOrderByUser,

        /* ------------------------------------Product Mutation-------------------------------------- */

                  addProductByMerchant:CreateProductsDetailByMerchant,
                  updateProductDetailByMerchant: UpdateProductDetail,


        /* ------------------------------------Product Review Mutation-------------------------------- */

                approveReview:MerchantReviewApproval,
                AddProductReviewRating:AddProductReviewRating,

        /* ------------------------------------User Mutation------------------------------------*/

                UserSignIn : UserSignIn ,
                UpdateUserDetailMutation : UpdateUserDetail,

            /* ------------------------------------User Mutation------------------------------------*/

                  AddCustomer : AddCustomer

         /*===========================================================================================
         ==============================================================================================*/

    }
});


// export root quries constant
module.exports= Mutation;
