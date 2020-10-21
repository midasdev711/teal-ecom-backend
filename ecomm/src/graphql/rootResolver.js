const ProductResolver = require("./productResolver");
const merchantResolver = require("./merchantResolver");
const orderResolver = require("./orderResolver");
const CategoryResolver = require('./categoryResolver');
const AuthResolver = require('./authResolver');
const { GraphQLUpload } = require('graphql-upload');
const root = {
  Upload: GraphQLUpload,
  Query: {
    products: ProductResolver.index,
    merchants: merchantResolver.index,
    orders: orderResolver.index,
    productCategories: CategoryResolver.index,
    getCategoryById: CategoryResolver.getCategory,
    getParentCategories: CategoryResolver.getParentCategories,
    getSubCategories: CategoryResolver.getSubCategory,
    getProductByMerchant: ProductResolver.getProductByMerchant,
    getAllProductsListing:ProductResolver.getAllProductsListing
    // categories: CategoryResolver.index,
    // users: UserResolver.index,
    // auth: AuthResolver.index,
  },
  Mutation: {
    upsertProduct: ProductResolver.upsert,
    upsertMerchant: merchantResolver.upsert,
    upsertOrder: orderResolver.upsert,
    // upsertCategory: CategoryResolver.upsert,
    upsertProductCategory: CategoryResolver.upsert,
    removeProduct: ProductResolver.removeProduct,
    updateProduct: ProductResolver.editProduct
    // upload: ProductResolver.fileUpload
    // upsertAuth: AuthResolver.upsert,
    // userAPIKey: AuthResolver.createAPIKey,

  }
};

module.exports = root;
