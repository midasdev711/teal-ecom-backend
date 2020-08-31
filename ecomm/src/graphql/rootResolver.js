const ProductResolver = require("./productResolver");
const merchantResolver = require("./merchantResolver");
const orderResolver = require("./orderResolver");
const root = {
  Query: {
    products: ProductResolver.index,
    merchants: merchantResolver.index,
    orders: orderResolver.index,
    // categories: CategoryResolver.index,
    // users: UserResolver.index,
    // auth: AuthResolver.index,
  },
  Mutation: {
    upsertProduct: ProductResolver.upsert,
    upsertMerchant: merchantResolver.upsert,
    upsertOrder: orderResolver.upsert,
    // upsertCategory: CategoryResolver.upsert,
    // upsertAuth: AuthResolver.upsert,
    // userAPIKey: AuthResolver.createAPIKey,
  },
};

module.exports = root;
