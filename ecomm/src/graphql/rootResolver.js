const ProductResolver = require("./productResolver");
const merchantResolver = require("./merchantResolver");
const orderResolver = require("./orderResolver");
const customerResolver = require("./customerResolver");
const root = {
  Query: {
    products: ProductResolver.index,
    merchants: merchantResolver.index,
    orders: orderResolver.index,
    customers: customerResolver.index,
    // categories: CategoryResolver.index,
    // users: UserResolver.index,
    // auth: AuthResolver.index,
  },
  Mutation: {
    upsertProduct: ProductResolver.upsert,
    upsertMerchant: merchantResolver.upsert,
    upsertOrder: orderResolver.upsert,
    upsertCustomer: customerResolver.upsert,
    // upsertCategory: CategoryResolver.upsert,
    // upsertAuth: AuthResolver.upsert,
    // userAPIKey: AuthResolver.createAPIKey,
  },
};

module.exports = root;
