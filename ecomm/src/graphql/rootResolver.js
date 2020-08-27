const ProductResolver = require("./productResolver");
const merchantResolver = require("./merchantResolver");
const root = {
  Query: {
    products: ProductResolver.index,
    merchants: merchantResolver.index,
    // categories: CategoryResolver.index,
    // users: UserResolver.index,
    // auth: AuthResolver.index,
  },
  Mutation: {
    upsertProducts: ProductResolver.upsert,
    upsertMerchants: ProductResolver.upsert,
    // upsertCategory: CategoryResolver.upsert,
    // upsertAuth: AuthResolver.upsert,
    // userAPIKey: AuthResolver.createAPIKey,
  },
};

module.exports = root;
