const typeDefs = `

type Article {
      ID: ID!
      id : ID
      Title: String!
      SubTitle: String
      TitleSlug: String 
      Description:String
      Slug: String!
      Sequence: ID
      Urls :String
      CreatedDate : String
      AuthorID : Int
      Authors : [String]
      isPublish : Boolean
      AmpSlug: String
      FeatureImage : String
      Thumbnail: String
      ReadMinutes: String
      ViewCount: Int
      Tags:[String]
      Status:Int
      TotalClapCount :Int 
      Categories : DefCategory
      TotalArticleCount : Int
      AcceptDonation : Boolean
      MinimumDonationAmount : Int
      isBookmark : Boolean
      isFollowed : Boolean
      isClicked : Boolean
      isContentAllowed : Boolean
      ArticleScope :Int
}
    

type DefCategory{
    ID: Int
    Name : String
    SubCategories: DefSubCategory
}

type DefSubCategory{
  ID: Int
  Name : String
}

input ArticleFilters {
  articleIds: [ID]
  ignoreArticleIds:[ID]
  AuthorID: Int
  UserID: Int
  AuthorUserName: String
  isPopular: Boolean
  Slug: String
  limit: Int
  page: Int
}

type Query {
    articles(filters: ArticleFilters):[Article]
}

  

`;
module.exports = typeDefs;
