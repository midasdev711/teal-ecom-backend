const typeDefs = `

type File
{
  filename: String!
  mimetype: String!
  encoding: String!
}

scalar Upload

type ProductCategoryType {
      ID : Int
      name : String
}

type ProductAttributeType{ 
      attributeName :String
      attributeValues :[String] 
}

type ProductVariantType {
      variantName : String
      variantsValues : String
}

input ProductVariantInput {
  variantName : String
  variantValues : String
}

input ProductAttributeInput{ 
  attributeName :String
  attributeValues :[String] 
}

type ProductSubcategoryType {
    ID : Int
    name : String 
    parentCategoryID : Int
}


 type ProductSEOType {
      title :String
      description :String 
      cronicalUrl : String
 }

 input ProductSEOInput {
  title :String
  description :String 
  cronicalUrl : String
}

 input ProductInput{
   productMerchantID: Int
   productMerchantName: String
   productSKU: String
   productTitle: String
   productSlug: String
   productDescription: String
   productMRP: Int
   productSalePrice: Int
   productThumbnailImage: Upload
   productFeaturedImage: Upload
   productImages : [Upload]
   productCategory: Int
   productSubcategory: Int
   productSEO: ProductSEOInput
   ampSlug: String
   productTotalQuantity: Int
   productInventory: String
   productTags: [String]
   productStock: Int
   productTermsAndConditions: String
   productVariants: [ProductVariantInput]
   productStartDate: String
   productEndDate: String
   productSearchEngineTitle: String
   productSearchEngineDescription: String
   productCostPerItem: Int
   isPublish: String
   productAttributes:[ProductAttributeInput]
 }
type Product {
      _id:String
      ID :Int 
      merchantID : Int 
      merchantName :String 
      sku : String 
      title :String 
      slug :String 
      description :String 
      thumbnailImage :String
      featuredImage : String
      images:[String]
      seo : ProductSEOType
      totalQuantity : Int
      inventory:Int
      tags : [String]
      stock : Int
      termsAndConditions :String 
      variants : [ProductVariantType]
      startDate : String
      endDate : String
      isPublish : String
      searchEngineTitle : String
      searchEngineDescription : String
      status : Int
      createdBy : String
      modifiedBy : String
      createdDate : String
      modifiedDate : String
      category:[productCatType]
      subCategory:[productCatType]
      attributes:[ProductAttributeType]
      mrp:Int
      salePrice:Int
      productCost:Int
}


type Merchant{
          _id: String
          ID: Int
          name:String
          userName :String
          email: String
          password : String
          mobileNo: String
          token: String
          refreshToken: String
          merchantLogo : String
          isAdminApproved : Boolean
          verificationToken :String
          businessName :String
          businessWebsite :String
          businessRegistrationNumber :String
          businessPhone :String
          businessAddress :String
          businessCountry :String
          businessState :String
          businessCity :String
          businessPostalCode :String
          contactPersonName :String
          contactPersonEmail :String
          contactPersonPhone :String 
          userID: String
}

input MerchantInput{
      merchantLogo: String
      businessName: String
      businessWebsite: String
      businessRegistrationNumber: String
      businessPhone:String
      businessAddress: String
      businessCountry: String
      businessState :String
      businessCity :String
      businessPostalCode :String
      contactPersonName :String
      contactPersonEmail :String
      contactPersonPhone :String 
      userID: String
      name: String
      mobileNo: String
      email: String
      password: String
}

input ProductFilters {
      productIds: [ID]
      ignoreProductIds:[ID]
      limit: Int
      page: Int
    }

    input MerchantFilters {
      merchantIds: [ID]
      ignoreMerchantIds:[ID]
    }


type OrderProductType {
        _id: String
        status:Int
        productID:String
        productMerchantID:Int
        productSKU:String
        productTitle:String
        productSalePrice:String
        productTotalQuantity:Int
        productTotalPrice:String
        productVariantID:String
        productVariantObject : VariantsType
        productObject : Product
}

input OrderProductInput {
  productID:String
        productMerchantID:Int
        productSKU:String
        productTitle:String
        productSalePrice:String
        productTotalQuantity:Int
        productTotalPrice:String
        productVariantID:String
        productObject : ProductInput
}

type  VariantsType{
      _id: String
      ID: Int 
      productID : String 
      merchantID : String
      costPrice  : String
      sellingPrice  : String
      variantStock  : String
      variantSKU : String
      variantImage : String
      status : Int
      productVariants  : VariantsAttribute
  }

  type VariantsAttribute{
        _id: String
       name : String
       value : String
}

type Order{
        _id: String
        ID: Int
        status: Int
        userID: Int
        orderAmount : String
        deliveryAddress: String
        shippingAddress : String
        products: [OrderProductType]
        paymentMethod: String
        tokenID: String
        createdAt: String
    }

input OrderInput{
  userID: Int
  orderAmount: String
  deliveryAddress: String
  shippingAddress : String
  products: [OrderProductInput]
}

    input OrderFilters {
      orderIds: [Int]
      ignoreOrderIds:[Int]
      limit: Int
      page: Int
    }

type Query {
      products(filters: ProductFilters):[Product]
      merchants(filters: MerchantFilters):[Merchant]
      orders(filters:OrderFilters):[Order]
      categories(filters: CategoryFilters):[ProductCategory]
      getCategoryById(ID:Int):ProductCategory
      getAllCategories:[ProductCategory]
      getSubCategories(ID:Int):[ProductCategory]
      getProductByMerchant(ID:Int):[MyProductType]
  }
  
  type Mutation {
    upsertProduct(product: ProductInput): Product
    upsertMerchant(merchant: MerchantInput): Merchant
    upsertOrder(order:OrderInput): Order
    upsertProductCategory(category: ProductCategoryInput): ProductCategory 
    upload(file: UploadFile!):File
  }

  input ProductCategoryInput{
    ID:Int
    Name: String
    Description: String 
    Slug: String
    isParent: Boolean 
    FeatureImage : String
    ParentCategoryID : Int
    Sequence : Int
    Type : Int
}


type ProductCategory{
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
}

input CategoryFilters {
  categoryIds: [ID]
  ignoreCategoryIds: [ID]
}


type MyProductType
{
  merchantID:Int
  merchantName:String
  totalQuantity:Int
  images:[String]
  startDate:String
  isPublish:String
  featuredImage:String
  slug:String
  thumbnailImage:String
  attributes:[ProductAttributeType]
  endDate:String
  variants:[ProductVariantType]
  tags:[String]
  description:String
  seo:ProductSEOType
  subCategory:[productCatType]
  category:[productCatType]
  sku:String
  title:String
  salePrice:String
  mrp:String
  productCost:String
  stock:Int
  ID:Int
 _id:String
}


type productCatType
{
  ID:Int
}

input UploadFile {
  id: Int!
  file: Upload!
}


`;

module.exports = typeDefs;
