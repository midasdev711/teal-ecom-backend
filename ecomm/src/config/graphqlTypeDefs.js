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
  _id: String
  ID: Int
  name: String
  totalQuantity: Int
  salePrice: Float
  mrp: Float
  costPerItem: Float
  yourShippingCost: Float
  images: [String]!
  thumbnailImage: String
  featuredImage: String!
  sku: String
  shippingRate: Float
  weight: Float
  weightUnit: String
}

input ProductVariantInput {
  ID: Int
  name: String
  totalQuantity: Int
  salePrice: Float
  mrp: Float
  costPerItem: Float
  yourShippingCost: Float
  images: [Upload]!
  thumbnailImage: Upload
  featuredImage: Upload!
  sku: String
  shippingRate: Float
  weight: Float
  weightUnit: String
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
   productExistingImages:[String]
   productId:Int
   productMerchantID: Int
   productMerchantName: String
   productSKU: String
   productTitle: String
   productSlug: String
   productDescription: String
   productMRP: Int
   productSalePrice: Int
   productYourShippingCost: Int
   productShippingCost: Int
   productThumbnailImage: Upload
   productFeaturedImage: Upload!
   productImages : [Upload]!
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
   editStatus: String
   views: Int
   revenue: String
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
  editStatus : String
  views: Int
  revenue: String
  searchEngineTitle : String
  searchEngineDescription : String
  status : Int
  createdBy : String
  modifiedBy : String
  createdDate : String
  modifiedDate : String
  category:Int
  subCategory:Int
  attributes:[ProductAttributeType]
  mrp:Int
  salePrice:Int
  productCost:Int
  yourShippingCost: Int
  shippingCost: Int
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

type  VariantsType{
  _id: String
  ID: Int 
  productID: String 
  merchantID: String
  costPrice: String
  sellingPrice: String
  variantStock: String
  variantSKU: String
  variantImage: String
  status: Int
  productVariants: VariantsAttribute
}

type VariantsAttribute{
  _id: String
  name : String
  value : String
}

type OrderProductType {
  _id: String
  ID: Int
  merchantID: Int
  merchantName: String
  sku: String
  title: String
  slug: String
  description: String
  mrp: Float
  salePrice: Float
  yourShippingCost: Float
  shippingCost: Float
  thumbnailImage: String
  featuredImage: String
  images: [String]
  category: Int
  subCategory: Int
  seo: ProductSEOType
  attributes: [ProductAttributeType]
  ampSlug: String
  totalQuantity: Int
  stock: Int
  termsAndConditions: String
  tags: [String]
  startDate: String
  endDate: String
  editStatus: String
  views: Int
  revenue: String
  searchEngineTitle: String
  searchEngineDescription: String
  status: Int
  createdBy: String
  modifiedBy: String
  createdDate: String
  modifiedDate: String
  weight: Float
  weightUnit: String
  name: String
  productCost: Float
  costPerItem: Float
  shippingRate: Float
  count: Int
}

input OrderProductInput {
  ID: Int
  merchantID: Int
  merchantName: String
  sku: String
  title: String
  slug: String
  description: String
  mrp: Float
  salePrice: Float
  yourShippingCost: Float
  shippingCost: Float
  thumbnailImage: String
  featuredImage: String
  images: [String]
  category: Int
  subCategory: Int
  seo: ProductSEOInput
  attributes: [ProductAttributeInput]
  ampSlug: String
  totalQuantity: Int
  stock: Int
  termsAndConditions: String
  tags: [String]
  startDate: String
  endDate: String
  editStatus: String
  views: Int
  revenue: String
  searchEngineTitle: String
  searchEngineDescription: String
  status: Int
  createdBy: String
  modifiedBy: String
  createdDate: String
  modifiedDate: String
  weight: Float
  weightUnit: String
  name: String
  productCost: Float
  costPerItem: Float
  shippingRate: Float
  count: Int
}

type Order{
  _id: String
  ID: Int
  status: Int
  userId: Int
  orderAmount: Float
  customer: Customer
  line_items: [OrderProductType]
  fulfillment_status: String
  fulfillments: [OrderProductType]
  paymentMethod: String
  transactionID: String
  createdAt: String
}

input OrderInput{
  status: Int
  userId: Int
  orderAmount : Float
  customer: OrderCustomerInput
  line_items: [OrderProductInput]
  fulfillment_status: String
  fulfillments: [OrderProductInput]
  paymentMethod: String
  transactionID: String
}

input OrderCustomerInput{
  ID: Int
  BasicDetailsFullName: String
  BasicDetailsEmail: String
  BasicDetailsMobile: String
  AddressDetailsAddress: String
  AddressDetailsApartment: String
  AddressDetailsCity: String
  AddressDetailsCountry: String
  AddressDetailsPostalCode: String
  AddressDetailsState: String
}

input OrderFilters {
  orderIds: [Int]
  ignoreOrderIds:[Int]
  limit: Int
  page: Int
}

type Customer {
  _id:String
  ID: Int
  BasicDetailsFullName: String
  BasicDetailsEmail: String
  BasicDetailsMobile: String
  AddressDetailsAddress: String
  AddressDetailsApartment: String
  AddressDetailsCity: String
  AddressDetailsCountry: String
  AddressDetailsPostalCode: String
  AddressDetailsState: String
  createdDate : String
  modifiedDate : String
}

input CustomerFilters{
  _id: String
  BasicDetailsFullName: String
  BasicDetailsEmail: String
  BasicDetailsMobile: String
  AddressDetailsAddress: String
  AddressDetailsApartment: String
  AddressDetailsCity: String
  AddressDetailsCountry: String
  AddressDetailsPostalCode: String
  AddressDetailsState: String
}
input CustomerInput{
  BasicDetailsFullName: String
  BasicDetailsEmail: String
  BasicDetailsMobile: String
  AddressDetailsAddress: String
  AddressDetailsApartment: String
  AddressDetailsCity: String
  AddressDetailsCountry: String
  AddressDetailsPostalCode: String
  AddressDetailsState: String
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
  editStatus:String
  views: Int
  revenue: String
  featuredImage:String
  slug:String
  thumbnailImage:String
  attributes:[ProductAttributeType]
  endDate:String
  variants:[ProductVariantType]
  tags:[String]
  description:String
  seo:ProductSEOType
  subCategory:Int
  category:Int
  sku:String
  title:String
  salePrice:String
  mrp:String
  productCost:String
  stock:Int
  ID:Int
  _id:String
  createdDate : String
  modifiedDate : String
  createdAt:String
}


type productCatType
{
  ID:Int
}


input UploadFile {
  id: Int!
  file: Upload!
}

type RemoveProduct
{
  ID:Int
  title:String
  message:String
}

input ProductUpdateInput
{
  productExistingImages:[String]
  productId:Int
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
  editStatus: String
  views: Int
  revenue: String
  productAttributes:[ProductAttributeInput]
}


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

type Blog {
  _id:String
  BlogTitle: String
  BlogPublishingPlace: String
  BlogCategory: String
  BlogPicture: String
  BlogUserID: Int
  BlogPageID: String
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
  BlogPageID: String
  createdDate : String
  modifiedDate : String
}

input BlogInput{
  BlogTitle: String
  BlogPublishingPlace: String
  BlogCategory: String
  BlogPicture: String
  BlogUserID: Int
  BlogPageID: String
}


type Query {
  products(filters: ProductFilters):[Product]
  merchants(filters: MerchantFilters):[Merchant]
  orders(filters:OrderFilters):[Order]
  customers(filters:CustomerFilters):[Customer]
  productCategories(filters: CategoryFilters):[ProductCategory]
  getCategoryById(ID:Int):ProductCategory
  getParentCategories:[ProductCategory]
  getSubCategories(ID:Int):[ProductCategory]
  getProductByMerchant(ID:Int):[MyProductType]
  getAllProductsListing:[ProductListing]
  pages(filters:PageFilters):[Page]
  blogs(filters:BlogFilters):[Blog]
}

type Mutation {
  upsertProduct(product: ProductInput): Product
  upsertMerchant(merchant: MerchantInput): Merchant
  upsertOrder(order:OrderInput): Order
  upsertCustomer(customer:CustomerInput): Customer
  upsertProductCategory(category: ProductCategoryInput): ProductCategory 
  upload(file: UploadFile!):File
  removeProduct(ID:Int):RemoveProduct
  updateProduct(product:ProductUpdateInput):Product
  sendUserInvite(invite: UserInvite): MailSuccess
  upsertPage(page:PageInput): Page
  upsertBlog(blog:BlogInput): Blog
}
type ProductListing
{
  _id:String
  merchantName:String
  images:[String]
  featuredImage:String
  thumbnailImage:String
  attributes:[ProductAttributeType]
  variants:[ProductVariantType]
  tags:[String]
  description:String
  sku:String
  title:String
  salePrice:String
  mrp:String
  stock:Int
}

input UserInvite
{
  email:String
  merchantId:Int
}

type MailSuccess
{
   email:String
   message:String 
}

`;

module.exports = typeDefs;
