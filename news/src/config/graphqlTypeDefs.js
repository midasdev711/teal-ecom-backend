const typeDefs = `
  scalar Upload

  scalar JSON
  

  input ArticleInput { 
    articleId: Int
    status: Int
    title: String
    subTitle : String
    description: String
    authorID : Int
    featureImage: Upload
    readMinutes : String
    tags: [String]
    isPublish : Boolean
    categories: [ArticleCategoryInput]
    acceptDonation : Boolean
    minimumDonationAmount : Float
    isPaidSubscription : Boolean
    articleScope : Int
    isDraft: Boolean
    deleteArticleIds : [ID],
    article_SEO:[ArticleSEOType]
    metaRobots:String
    internalArticle:Boolean
    descriptionJson:JSON
  }

 

  input ArticleSEOType
  {
    metaTitle:String
    metaDescription:String
    conicalUrl:String
    keyPhrases:[String]
  }

  input ArticleCategoryInput {
    ID: Int
    name: String
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
    isDraft: Boolean
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
    clapCountUser:[User]
    isArticleLiked: Boolean
    createdAt:String
    article_SEO:[SEOType]
    metaRobots:String
    internalArticle:Boolean
    descriptionJson:JSON
  }

type SEOType
{
  metaTitle:String
  metaDescription:String
  conicalUrl:String
  keyPhrases:[String]
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

type Campaign{
  ID: ID!
  id: ID
  CampaignName: String
  ArticleId1: Article 
  ArticleId2: Article 
  createdDate : String
  Views : String
  Reactions : String
  Revenue : String
  CTR: String
  SplitId: Int
  author : [User]
  isDeleted: Boolean
}
input CampaignInput{
  CampaignName: String
  ArticleId1: Int 
  ArticleId2: Int 
  ID: Int 
  isDeleted: Boolean
  IdArray: [Int]
  authorID : Int
}

input CampaignFilters{
  CampaignName: String
  campaignIds: ID
  SplitId: Int
  isDeleted: Boolean
  userId: Int
}


input ArticleFilters {
  articleIds: [ID]
  articleId: ID
  ignoreArticleIds:[ID]
  authorId: Int
  userId: Int
  authorUserName: String
  isPopular: Boolean
  slug: String
  deletedArticlesAuthorId: ID
  getDraft:Boolean
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
  totalWalletAmount : String
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
  apiKey: String
}

input UserInput {
  userId: Int
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
  categoryType: Int
}

type UserParentCategory {
  ID: Int
  name: String
  categoryType: Int
}

input UsersParentCategoryInput {
  ID: Int
  name: String
  categoryType: Int
}

input SubcategoriesInput {
  ID: Int
  name: String
  parentCategoryID: Int
  categoryType: Int
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
  mobileNo: String
  userId : Int
  apiKey : String
  limit: Int
  page: Int
}

type APIKey{
  apiKey: String
}

type ArticleRating{
      ID: Int
      description :String
      userID : Int
      clapCount :Int
      upVote  : String
      downVote : String
      articleID : Int
      status : String
      article : Article
}     

input ArticleRBInput{
      userID:Int
      articleID: Int
}

type ArticleBookmark{
      ID: Int
      articleID: Int
      userID: Int!
      status : Int
      article: Article
}


type UserSettingType {
  userId : Int
  account : User
  privacy : PrivacyType
  notification : NotificationType
  isPaidSubscription : Boolean
  paidSubscription : [ID]
}

type UserAccountType {
  name: String 
  email: String
  userName :  String
  isFacebook : Boolean
  avatar: String
}




type PrivacyType {
  isFollowersShow: Boolean
    isFollowingShow: Boolean
    isFollowButtonShow: Boolean
    isSocialLinksShow: Boolean
    isProfileBioShow:Boolean
}

type ButtonType {
  isDaily : Boolean
  isWeekly : Boolean 
  isOff :Boolean 
}

type TrendingType {
  isEmail : Boolean 
  isPush : Boolean 
  button : ButtonType 
}

type SocialActivityType {
  isEmail : Boolean 
  isPush : Boolean 
}

type PagesFollowType {
  isEmail : Boolean
  isPush : Boolean
}

type AuthorsFollowType {
  isEmail : Boolean 
  isPush : Boolean 
}

type PagesLikeType {
  isEmail : Boolean
  isPush : Boolean
  button : ButtonType
}

type AuthorsLikeType {
  isEmail : Boolean
  isPush : Boolean
  button : ButtonType 
}

type RecommendedType {
  isEmail : Boolean
  isPush : Boolean
  button : ButtonType
}

type NotificationType {
      trending :TrendingType
      recommended : RecommendedType
      authorsLike: AuthorsLikeType
      pagesLike: PagesLikeType
      authorsFollow: AuthorsFollowType
      pagesFollow: PagesFollowType
      socialActivity: SocialActivityType
}


input UserAccountInput {
    name: String 
    email: String
    userName :  String
    isFacebook : Boolean
    oldPassword: String
    newPassword: String
}

input PrivacyInput {
  isFollowersShow: Boolean
  isFollowingShow: Boolean
  isFollowButtonShow: Boolean
  isSocialLinksShow: Boolean
  isProfileBioShow:Boolean 
  }

input ButtonInput {
    isDaily : Boolean
    isWeekly : Boolean 
    isOff :Boolean 
}

input TrendingInput {
    isEmail : Boolean 
    isPush : Boolean 
    button : ButtonInput 
}

input SocialActivityInput {
    isEmail : Boolean 
    isPush : Boolean 
}

input PagesFollowInput {
    isEmail : Boolean
    isPush : Boolean
}

input AuthorsFollowInput {
    isEmail : Boolean 
    isPush : Boolean 
}

input PagesLikeInput {
    isEmail : Boolean
    isPush : Boolean
    button : ButtonInput
}

input AuthorsLikeInput {
    isEmail : Boolean
    isPush : Boolean
    button : ButtonInput 
}

input RecommendedInput {
    isEmail : Boolean
    isPush : Boolean
    button : ButtonInput
}

input NotificationInput {
        trending :TrendingInput
        recommended : RecommendedInput
        authorsLike: AuthorsLikeInput
        pagesLike: PagesLikeInput
        authorsFollow: AuthorsFollowInput
        pagesFollow: PagesFollowInput
        socialActivity: SocialActivityInput
}

input PaidSubscriptionInput {
        subscriptionID : Int
        name : String
        amount : String
        description : String
        days : Int
        status : Int
}

input UserSettingInput {
  userId : Int
  account : UserAccountInput
  privacy : PrivacyInput
  notification : NotificationInput
  isPaidSubscription : Boolean
  paidSubscription : [ID]
  oldPassword: String
  newPassword: String
}

input VerifyCodeObject {
  email: String
  provider: String,
  mobileNo: String,
  code: Int
}

type Query {
    articles(filters: ArticleFilters):[Article]
    uploadArticles: String
    categories(filters: CategoryFilters):[Category]
    users(filters: UserFilters):[User]
    auth(uniqueID: String password: String) : User
    socialAuth(email: String signUpMethod: String) : User
    userSetting(userId:ID): UserSettingType
    campaign(filters: CampaignFilters): [Campaign]
}

type Mutation {
  upsertArticle(article: ArticleInput): Article
  upsertCategory(category: CategoryInput): Category 
  upsertAuth(auth: UserInput) : User
  sendEmailVerifyCode(email: String): Boolean
  sendMobileVerifyCode(mobileNo: String): Boolean
  verifyCode(codeObject: VerifyCodeObject): Boolean
  userAPIKey(UserID:ID!): String
  upsertArticleRating(articleRating: ArticleRBInput): ArticleRating
  upsertArticleBookmark(articleBookmark: ArticleRBInput): ArticleBookmark
  upsertUserSetting(userSetting: UserSettingInput): UserSettingType
  upsertCampaign(campaign: CampaignInput): Campaign
  uploadArticleImg(articleImgInput:UploadArticleImgInput):ArticleImage
}


input UploadArticleImgInput
{
  articleImage:Upload
}

type ArticleImage
{
  imgUrl: String
}

`;

module.exports = typeDefs;
