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
          contactPersonEmail :Email
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
      contactPersonEmail :Email
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


    const DecimalConvertOrderAmount = new GraphQLScalarType({
      name : "convertToDecimalOrderAmount",
      resolve(parent){
          return parseFloat(parent.OrderAmount);
      }
});

const DecimalConvertItemTotalPrice = new GraphQLScalarType({
    name : "convertToDecimalOrderProductTotalPrice",
    resolve(parent){
        return parseFloat(parent.ProductTotalPrice);
    }
});

const DecimalConvertProductSalePrice = new GraphQLScalarType({
    name : "convertToDecimalOrderProductSalePrice",
    resolve(parent){
        return parseFloat(parent.ProductSalePrice);
    }
});


const OrderProductType {
        _id: String
        status: { type: GraphQLInt },
        productID:{type :GraphQLString},
        productMerchantID:{type :GraphQLInt},
        productSKU:{type :GraphQLString},
        productTitle:{type :GraphQLString},
        productSalePrice:{type :DecimalConvertProductSalePrice },
        productTotalQuantity:{type :GraphQLInt},
        productTotalPrice:{type :DecimalConvertItemTotalPrice },
        productVariantID:{type :GraphQLString},
        ProductVariantObject : {
        variantType : VariantsType,
        resolve : async (parent, args) => {
            let variationDetails = await VariantDetails.find({ _id : parent.ProductVariantID, Status : 1 });
            let variationData ;
            if(variationDetails.length > 0)
             {
                variationData = variationDetails[0]
             }
            return variationData
         }
      },
      ProductObject : {
        type : ProductType,
        resolve : async (parent, args) => {
            let productDetails = await ProductDetails.find({ ProductID : parent.ProductID, Status : 1 });
            let productData ;
            if(productDetails.length > 0)
             {
                productData = productDetails[0];
             }
            return productData
         }
      },
    })
});


type Order{
        _id: String
        ID: Int
        status: Int
        userID: String
        orderAmount : String
        deliveryAddress: Object
        shippingAddress : Object
        products: [OrderProductType]
        paymentMethod: String
        tokenID: String
        createdAt: String
    }

type Query {
      products(filters: ProductFilters):[Product]
      merchants(filters: MerchantFilters):[Merchant]
  }
  
  type Mutation {
    upsertProduct(product: ProductInput): Product
    upsertMerchant(merchant: MerchantInput)
  }
`;

module.exports = typeDefs;
