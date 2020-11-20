const typeDefs = `
  type Store {
    _id:String
    StoreTitle: String
    StoreDescription: String
    StoreCategory: String,
    StoreUserName: String,
    StoreEmail: String,
    StorePhone: String,
    StoreWebsite: String,
    StoreLocation: String,
    StoreUserID: Int
    StorePageID: Int
    createdDate: String
    modifiedDate: String
  }

  input StoreFilters{
    _id:String
    StoreTitle: String
    StoreDescription: String
    StoreCategory: String,
    StoreUserName: String,
    StoreEmail: String,
    StorePhone: String,
    StoreWebsite: String,
    StoreLocation: String,
    StoreUserID: Int
    StorePageID: Int
    createdDate: String
    modifiedDate: String
  }

  input StoreInput{
    StoreTitle: String
    StoreDescription: String
    StoreCategory: String,
    StoreUserName: String,
    StoreEmail: String,
    StorePhone: String,
    StoreWebsite: String,
    StoreLocation: String,
    StoreUserID: Int
    StorePageID: Int
  }

  type Query {
    stores(filters:StoreFilters):[store]
  }

  type Mutation {
    upsertStore(store:StoreInput): store
  }
`;

module.exports = typeDefs;

