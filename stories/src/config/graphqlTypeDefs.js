const typeDefs = `

type Blog {
  _id:String
  BlogTitle: String
  BlogPublishingPlace: String
  BlogCategory: String
  BlogPicture: String
  BlogUserID: Int
  createdDate : String
  modifiedDate : String
}

input BlogFilters{
  _id:String
  BlogTitle: String
  BlogPublishingPlace: String
  BlogCategory: String
  BlogPicture: String
  BlogUserID: Int
  createdDate : String
  modifiedDate : String
}

input BlogInput{
  BlogTitle: String
  BlogPublishingPlace: String
  BlogCategory: String
  BlogPicture: String
  BlogUserID: Int
}

type Query {
  blogs(filters:BlogFilters):[Blog]
}

type Mutation {
  upsertBlog(blog:BlogInput): Blog
}
`;

module.exports = typeDefs;
