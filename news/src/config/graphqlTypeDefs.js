const typeDefs = `
  input ArticleInput { 
    ID: Int
    title: String
    subTitle : String
    description: String
    authorID : Int
    featureImage: String
    readMinutes : String
    tags: [String]
    isPublish : Boolean
    categories: ArticleCategoryInput,
    acceptDonation : Boolean
    minimumDonationAmount : Float
    isPaidSubscription : Boolean
    articleScope : Int
  }

  input ArticleCategoryInput {
    ID: Int
    name: String
    subCategories :[SubCategoriesInput]
  }

  input SubCategoriesInput {
    ID: Int
    name: String
  }

  type Article {
    ID: ID!
    id : ID
    title: String!
    subTitle: String
    titleSlug: String 
    description:String
    slug: String!
    sequence: ID
    urls :String
    createdDate : String
    author : [User]
    isPublish : Boolean
    ampSlug: String
    featureImage : String
    thumbnail: String
    readMinutes: String
    viewCount: Int
    tags:[String]
    status:Int
    totalClapCount :Int 
    categories : DefCategory
    totalArticleCount : Int
    acceptDonation : Boolean
    minimumDonationAmount : String
    isBookmark : Boolean
    isFollowed : Boolean
    isClicked : Boolean
    isContentAllowed : Boolean
    articleScope :Int
  }

type DefCategory{
    ID: Int
    name : String
    subCategories: DefSubCategory
}

type DefSubCategory{
  ID: Int
  name : String
}

input CategoryInput{
    name: String
    description: String 
    slug: String
    isParent: Boolean 
    featureImage : String
    parentCategoryID : Int
    sequence : Int
    type : Int
    subCategories : [SubCategoryInput]
}

input SubCategoryInput{
  ID: Int
  name: String
  parentCategoryID: Int
  type: Int
} 

type Category{
  ID: ID!
  id: ID
  name: String
  description: String 
  status: Int 
  slug: String
  isParent: Boolean 
  featureImage : String
  parentCategoryID : Int
  createdDate :  String
  modifiedDate :  String
  sequence : Int
  type : Int
  subCategories : [Category]
}

input ArticleFilters {
  articleIds: [ID]
  ignoreArticleIds:[ID]
  authorID: Int
  userID: Int
  authorUserName: String
  isPopular: Boolean
  slug: String
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
  creativeToken: String
  name: String
  userName : String
  email : String
  description: String
  status: Int
  password: String
  roleID : Int
  avatar: String
  isVerified : Boolean
  signUpMethod: String 
  faceBookUrl : String
  userCounter  : Int
  totalWalletAmount : Float
  isPaidSubscription : Boolean
  paidSubscription : [PaidSubscriptionType]
  following : Int
  follower : Int
  parentCategories : [UserParentCategory]
  subCategories : [SubCategories]
  createdDate :  String
  modifiedDate :  String
  mobileNo : String
  dob : String
  gender : String
  uniqueID : String
  referenceID : String
  freeArticles : [Article]
  premiumArticles : [Article]
  activityLog : ActivityLogUsers
  ipAddress : String
  isFollowing : Boolean
  isSubscriptionAllowed : Boolean
}

input UserInput {
  name: String
  email : String
  password: String
  avatar: String
  signUpMethod: String 
  faceBookUrl : String
  mobileNo : String
  dob : String
  gender : String
  parentCategories : [UsersParentCategoryInput]
  subCategories : [SubcategoriesInput]
  referenceID : String
}

type SubCategories {
  ID: Int
  name: String
  parentCategoryID: Int
  type: Int
}

type UserParentCategory {
  ID: Int
  name: String
  type: Int
}

input UsersParentCategoryInput {
  ID: Int
  name: String
  type: Int
}

input SubcategoriesInput {
  ID: Int
  name: String
  parentCategoryID: Int
  type: Int
}

type PaidSubscriptionType {
    subscriptionID : Int
    name : String
    amount : Float
    description : String
    days : Int
    status : Int
  }

type ActivityLogUsers {
      latestArticles : [Article]
      clapedArticles : [Article]
      recentlyVisited : [Article]
      bookmarkedArticles : [Article]
}


input UserFilters {
  userIds: [ID]
  ignoreUserIds:[ID]
  email : String
  userId : Int
  apiKey : String
  limit: Int
  page: Int
}

type APIKey{
  apiKey: String
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
  upsertAuth(auth: UserInput) : User
  userAPIKey(UserID:ID!): String
}
`;

module.exports = typeDefs;
