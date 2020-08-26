const typeDefs = `
type ProductCategoryType {
      ID : Int
      name : String
}

type ProductAttributeType{ 
      _id: String
      attributsName :String
      attributeValues :[String] 
}

type ProductVariantType {
      variantName : String
      variantsValues : String
}

input ProductVariantInput {
  variantName : String
  variantsValues : String
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
   productMRP: String
   productSalePrice: String
   productThumbnailImage: String
   productFeaturedImage: String
   productImages : String
   productCategory: Int
   productSubcategory: Int
   productSEO: ProductSEOInput
   ampSlug: String
   productTotalQuantity: Int
   productInventory: Int
   productTags: [String]
   productStock: Int
   productTermsAndConditions: String
   productVariants: ProductVariantInput
   productAttributes: Int
   productStartDate: String
   productEndDate: String
   productSearchEngineTitle: String
   productSearchEngineDescription: String
 }
type Product {
      _id:String
      productID :Int 
      productMerchantID : Int 
      productMerchantName :String 
      productSKU : String 
      productTitle :String 
      productSlug :String 
      productDescription :String 
      productMRP : String 
      productSalePrice : String
      productThumbnailImage :String 
      productFeaturedImage : String
      productImages:String
      productCategory : ProductCategoryType
      productSubcategory :ProductSubcategoryType
      productSEO : ProductSEOType
      ampSlug :String
      productTotalQuantity : Int
      productInventory:Int
      productTags : [String]
      productStock : Int
      productTermsAndConditions :String 
      productVariants : ProductVariantType
      productAttributes : ProductAttributeType
      productStartDate : String
      productEndDate : String
      isPublish : String
      productSearchEngineTitle : String
      productSearchEngineDescription : String
      status : Int
      createdBy : String
      modifiedBy : String
      createdDate : String
      modifiedDate : String
`;

module.exports = typeDefs;
