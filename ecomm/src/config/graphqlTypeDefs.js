const typeDefs = `
type ProductCategoryType {
      ID : Int
      name : String
}

type ProductAttributeType{ 
      _id: String
      attributeName :String
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
    type Customer {
      _id:String
      BasicDetailsFirstName: String
      BasicDetailsLastName: String
      BasicDetailsEmail: String
      BasicDetailsMobile: String
      BasicDetailsEmailFlag: Boolean
      AddressDetailsFirstName: String
      AddressDetailsLastName: String
      AddressDetailsCompany: String
      AddressDetailsApartment: String
      AddressDetailsCity: String
      AddressDetailsCountry: String
      AddressDetailsPostalCode: String
      AddressDetailsMobile: String
      Tax : Int
      Notes: String
      Tags: String
      createdDate : String
      modifiedDate : String
}

input CustomerFilters{
      _id: String
      BasicDetailsFirstName: String
      BasicDetailsLastName: String
      BasicDetailsEmail: String
      BasicDetailsMobile: String
      BasicDetailsEmailFlag: Boolean
      AddressDetailsFirstName: String
      AddressDetailsLastName: String
      AddressDetailsCompany: String
      AddressDetailsApartment: String
      AddressDetailsCity: String
      AddressDetailsCountry: String
      AddressDetailsPostalCode: String
      AddressDetailsMobile: String
      Tax : Int
      Notes: String
      Tags: String
  }
  input CustomerInput{
      BasicDetailsFirstName: String
      BasicDetailsLastName: String
      BasicDetailsEmail: String
      BasicDetailsMobile: String
      BasicDetailsEmailFlag: Boolean
      AddressDetailsFirstName: String
      AddressDetailsLastName: String
      AddressDetailsCompany: String
      AddressDetailsApartment: String
      AddressDetailsCity: String
      AddressDetailsCountry: String
      AddressDetailsPostalCode: String
      AddressDetailsMobile: String
      Tax : Int
      Notes: String
      Tags: String
  }

type Query {
      products(filters: ProductFilters):[Product]
      merchants(filters: MerchantFilters):[Merchant]
      orders(filters:OrderFilters):[Order]
      customers(filters:CustomerFilters):[Customer]
  }
  
  type Mutation {
    upsertProduct(product: ProductInput): Product
    upsertMerchant(merchant: MerchantInput): Merchant
    upsertOrder(order:OrderInput): Order
    upsertCustomer(customer:CustomerInput): Customer
  }
`;

module.exports = typeDefs;
