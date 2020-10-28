/*
  * Created By : Yashco Systems
  * Purpose : all root queries
*/

const { GraphQLObjectType } = require('graphql');

const { AdminCategoryAll } = require('../root_queries/admin_queries');

const { VariantsByProductID } = require('../root_queries/variant_queries');

const { ListAttribute } = require('../root_queries/attribute_queries');

const { AllProductCategoryList, AllProductSubCategoryList,
        AllProductCategoryListWithPagination, AllProductSubCategoryListWithPagination ,
        CategoryDetailsByID  } = require('../root_queries/category_queries');

const { GetUserShoppingCartDetailsByID ,GetOrderDetailsByID ,
        GetOrderDetailsByUserID ,GetUserShoppingCartDetailsByShoppingCardID,
        MerchantCancelledOrderList , MerchantActiveOrderList ,LastOrderActivity, DisplayOrderListToAdmin
      } = require('../root_queries/order_queries');

const { ProductCatgoryAll , TopProduct , ProductDetailsByID ,
  ShopListByCategorySubCategory , MerchantProductList ,GetProductDetailByProductID } = require('../root_queries/product_queries');

const { GetAllApproveReview , GetAllUnApproveReview
      } = require('../root_queries/product_reviews_queries');

const {  UserCategoryWithPagination , UserCategoryAll ,
         UserDetailByID } = require('../root_queries/user_queries');

const { MerchantCategoryAll,MerchantCategoryByID,
        MerchantCategoryWithPagination ,MerchantBusinessCatgoryByID,
  MerchantContactsCatgoryByID }  = require('../root_queries/merchant_queries');

  const { GetCustomers  } = require('../root_queries/customer_queries'),

// declared root query constant
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

           /* ------------------------------------Admin Queries-------------------------------- */

                        getAllAdminList : AdminCategoryAll,


           /* ------------------------------------variant Mutation------------------------------ */

                        getVariantListByProductID:VariantsByProductID,

           /* ------------------------------------Attribute Queries------------------------------ */

                         getListAttribute: ListAttribute,

          /* ------------------------------------Categories Queries------------------------------- */
                    getAllCategoryList:AllProductCategoryList,
                    getAllSubCategoryList:AllProductSubCategoryList,
                    getAllCategoryListWithPagination :AllProductCategoryListWithPagination,
                    getAllSubCategoryListWithPagination :AllProductSubCategoryListWithPagination,
                    getCategoryDetailsByID:CategoryDetailsByID,

          /* ------------------------------------Order Queries------------------------------- */

                    getUserShoppingCartDetailsByID : GetUserShoppingCartDetailsByID,
                    getOrderDetailsByID :GetOrderDetailsByID,
                    getOrderDetailsByUserID :GetOrderDetailsByUserID,
                    merchantActiveOrderList: MerchantActiveOrderList,
                    merchantCancelledOrderList:MerchantCancelledOrderList,
                    getUserShoppingCartDetailsByShoppingID : GetUserShoppingCartDetailsByShoppingCardID,
                    getLastOrder:LastOrderActivity,
					getOrderListToAdmin:DisplayOrderListToAdmin,

          /* ------------------------------------Product Queries------------------------------- */
                    getAllProducts : ProductCatgoryAll,
                    getTopProduct:TopProduct,
                    getProductDetailsByID:ProductDetailsByID,
                    getProductByMerchant:MerchantProductList,
                    getShopListByCategory: ShopListByCategorySubCategory,
                    getProductDetailById:GetProductDetailByProductID,

          /* ------------------------------------ProductReviews Queries------------------------------- */
                      getUnApproveReview:  GetAllUnApproveReview,
                      getApproveReview:GetAllApproveReview ,

          /* ------------------------------------User Queries------------------------------- */
                        getUserListWithPagination: UserCategoryWithPagination,
                        getAllUserList : UserCategoryAll,
                        getUserDetailByID : UserDetailByID,

          /* ------------------------------------Merchant Queries------------------------------ */
                    getAllMerchatList : MerchantCategoryAll,
                    getMerchantListWithPagination: MerchantCategoryWithPagination,
                    getMerchantDetailsByID:MerchantCategoryByID,
                    getMerchantBusinessByID:MerchantBusinessCatgoryByID,
                    getMerchantContactByID:MerchantContactsCatgoryByID,

          /* ------------------------------------Customers Queries------------------------------ */
                  GetCustomers : GetCustomers,
    }
  });



  // export root quries constant
  module.exports= RootQuery;
