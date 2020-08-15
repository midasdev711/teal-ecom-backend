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
    Categories: ArticleCategoryInput,
    AcceptDonation : Boolean
    MinimumDonationAmount : Float
    isPaidSubscription : Boolean
    ArticleScope : Int
  }

  input ArticleCategoryInput {
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

input CategoryInput{
    Name: String
    Description: String 
    Slug: String
    isParent: Boolean 
    FeatureImage : String
    ParentCategoryID : Int
    Sequence : Int
    Type : Int
    SubCategories : [SubCategoryInput]
}

input SubCategoryInput{
  ID: Int
  Name: String
  ParentCategoryID: Int
  Type: Int
} 

type Category{
  ID: ID!
  id: ID
  Name: String
  Description: String 
  Status: Int 
  Slug: String
  isParent: Boolean 
  FeatureImage : String
  ParentCategoryID : Int
  CreatedDate :  String
  ModifiedDate :  String
  Sequence : Int
  Type : Int
  SubCategories : [Category]
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

input CategoryFilters {
  categoryIds: [ID]
  ignoreCategoryIds: [ID]
}



type Query {
    articles(filters: ArticleFilters):[Article]
    categories(filters: CategoryFilters):[Category]
}

type Mutation {
  upsertArticle(article: ArticleInput): Article
  upsertCategory(article: ArticleInput): Category 
}
`;
module.exports = typeDefs;
