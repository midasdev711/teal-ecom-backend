const typeDefs = `

type Page {
  _id:String
  PageTitle: String
  PageDescription: String
  PageCategory: String,
  PageUserName: String,
  PageEmail: String,
  PagePhone: String,
  PageWebsite: String,
  PageLocation: String,
  PageUserID: Int
  createdDate: String
  modifiedDate: String
}

input PageFilters{
  _id:String
  PageTitle: String
  PageDescription: String
  PageCategory: String,
  PageUserName: String,
  PageEmail: String,
  PagePhone: String,
  PageWebsite: String,
  PageLocation: String,
  PageUserID: Int
  createdDate: String
  modifiedDate: String
}

input PageInput{
  PageTitle: String
  PageDescription: String
  PageCategory: String,
  PageUserName: String,
  PageEmail: String,
  PagePhone: String,
  PageWebsite: String,
  PageLocation: String,
  PageUserID: Int
}

type Query {
  pages(filters:PageFilters):[page]
}

type Mutation {
  upsertPage(page:PageInput): page
}
`;

module.exports = typeDefs;

