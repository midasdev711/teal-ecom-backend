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
    MinimumDonationAmount : String
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

type User {
  ID: Int
  token: String
  refreshToken: String
  CreativeToken: String
  Name: String
  UserName : String
  Email : String
  Description: String
  Status: Int
  Password: String
  RoleID : Int
  Avatar: String
  isVerified : Boolean
  SignUpMethod: String 
  FaceBookUrl : String
  UserCounter  : Int
  TotalWalletAmount : Float
  isPaidSubscription : Boolean
  PaidSubscription : [PaidSubscriptionType]
  Following : Int
  Follower : Int
  ParentCategories : [UserParentCategory]
  SubCategories : [SubCategories]
  CreatedDate :  String
  ModifiedDate :  String
  MobileNo : String
  Dob : String
  Gender : String
  UniqueID : String
  ReferenceID : String
  FreeArticles : [Article]
  PremiumArticles : [Article]
  ActivityLog : ActivityLogUsers
  IpAddress : String
  isFollowing : Boolean
  isSubscriptionAllowed : Boolean
}

input UserInput {
  Name: String
  Email : String
  Password: String
  Avatar: String
  SignUpMethod: String 
  FaceBookUrl : String
  MobileNo : String
  Dob : String
  Gender : String
  ParentCategories : [UsersParentCategoryInput]
  SubCategories : [SubcategoriesInput]
  ReferenceID : String
}

type SubCategories {
  ID: Int
  Name: String
  ParentCategoryID: Int
  Type: Int
}

type UserParentCategory {
  ID: Int
  Name: String
  Type: Int
}

input UsersParentCategoryInput {
  ID: Int
  Name: String
  Type: Int
}

input SubcategoriesInput {
  ID: Int
  Name: String
  ParentCategoryID: Int
  Type: Int
}

type PaidSubscriptionType {
    SubscriptionID : Int
    Name : String
    Amount : Float
    Description : String
    Days : Int
    Status : Int
  }

type ActivityLogUsers {
      LatestArticles : [Article]
      ClapedArticles : [Article]
      RecentlyVisited : [Article]
      BookmarkedArticles : [Article]
}


input UserFilters {
  userIds: [ID]
  ignoreUserIds:[ID]
  Email : String
  UserId : Int
  limit: Int
  page: Int
}


type Query {
    articles(filters: ArticleFilters):[Article]
    categories(filters: CategoryFilters):[Category]
    users(filters: UserFilters):[User]
    auth(Email: String Password: String) : User
}

type Mutation {
  upsertArticle(article: ArticleInput): Article
  upsertCategory(category: CategoryInput): Category 
  upsertUser(user: UserInput) : User
  upsertAuth(auth: UserInput) : User
}
`;
module.exports = typeDefs;
