const typeDefs = `

type Article {

      _id: ID!
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
      Status:ID
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

type Category{
    _id: Int
    Name: String
    Description: String 
    Status: Int 
    Slug: String
    isParent: Boolean 
    FeatureImage : String
    ParentCategoryID : Int
    CreatedDate :  Date
    ModifiedDate :  Date
    Sequence : Int
    Type : Int
    SubCategories : Category
}

type ParentCategory
    ID: Int
    Name: String
    Type: Int
  
}

// sub category sub object type def for usertype
type Subcategories{
    ID: Int
    Name: String
    ParentCategoryID: Int
    Type: Int
}

type Query {
  articles(ids: [ID], limit: Int, page: Int):[Article]
  article(ID: Int): Article
  categories(ids: [ID]):[Category]
  category(ID: Int): Category
}

  

`;
module.exports = typeDefs;
