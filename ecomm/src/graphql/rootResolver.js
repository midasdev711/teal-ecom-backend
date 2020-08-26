const ProductResolver = require("./productResolver");
const root = {
  Query: {
    products: ProductResolver.index,
    // categories: CategoryResolver.index,
    // users: UserResolver.index,
    // auth: AuthResolver.index,
  },
  Mutation: {
    upsertProducts: ProductResolver.upsert,
    // upsertCategory: CategoryResolver.upsert,
    // upsertAuth: AuthResolver.upsert,
    // userAPIKey: AuthResolver.createAPIKey,
  },
};

module.exports = root;
