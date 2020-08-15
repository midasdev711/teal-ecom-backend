const typeDefs = `
  input ArticleInput { 
    ID: Int
    Title: String
    SubTitle : String
    Description: String
    AuthorID : Int
    FeatureImage: String
    ReadMinutes : String
    Tags: [String]
    isPublish : Boolean
    Categories: CategoryInput,
    AcceptDonation : Boolean
    MinimumDonationAmount : Float
    isPaidSubscription : Boolean
    ArticleScope : Int
  }

  input CategoryInput {
    ID: Int
    Name: String
    SubCategories :[SubCategoriesInput]
  }

  input SubCategoriesInput {
    ID: Int
    Name: String
  }

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

type Mutation {
  upsertArticle(article: ArticleInput): Article
}
`;
module.exports = typeDefs;
