const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaType = Schema.Types;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const ProductSchema = new Schema(
  {
    productID: { type: Number, required: true, exists: false, unique: true },
    productMerchantID: { type: Number },
    productMerchantName: { type: String },
    productSKU: { type: String, default: "" },
    productTitle: { type: String, exists: false, unique: true },
    productSlug: { type: String },
    productDescription: { type: String },
    productMRP: { type: SchemaType.Decimal128 },
    productSalePrice: { type: SchemaType.Decimal128 },
    productThumnailImage: { type: String, default: "" },
    productFeaturedImage: { type: String },
    productImages: [{ type: String }],
    productCategory: [
      {
        ID: { type: Number },
        name: { type: String },
      },
    ],
    productSubcategory: [
      {
        ID: { type: Number },
        name: { type: String },
        parentCategoryID: { type: Number },
      },
    ],
    productSEO: {
      title: { type: String },
      description: { type: String },
      cronicalUrl: { type: String },
    },
    productAttributes: [
      {
        attributsName: { type: String },
        attributeValues: [{ type: String }],
      },
    ],
    ampSlug: { type: String },
    productTotalQuantity: { type: Number },
    productStock: { type: Number, default: "" },
    productTermsAndConditions: { type: String },
    productTags: { type: Array },
    productStartDate: { type: Date, default: Date.now() },
    productEndDate: { type: Date, default: Date.now() },
    isPublish: { type: String },
    productSearchEngineTitle: { type: String },
    productSearchEngineDescription: { type: String },
    status: { type: Number, default: 1 },
    createdBy: { type: Number },
    modifiedBy: { type: Number },
    createdDate: { type: Date, default: Date.now() },
    modifiedDate: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

ProductSchema.plugin(autoIncrement.plugin, {
  model: "products",
  field: "ProductID",
  startAt: 100,
});
module.exports = mongoose.model("products", ProductSchema);
