const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaType = Schema.Types;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const ProductSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    merchantID: { type: Number },
    merchantName: { type: String },
    sku: { type: String, default: "" },
    title: { type: String, exists: false, unique: true },
    slug: { type: String },
    description: { type: String },
    mrp: { type: Number },
    salePrice: { type: Number },
    yourShippingCost: { type: Number },
    shippingCost: { type: Number },
    thumbnailImage: { type: String, default: "" },
    featuredImage: { type: String },
    images: [{ type: String }],
    category: [
      {
        ID: { type: Number },
        name: { type: String },
      },
    ],
    subCategory: [
      {
        ID: { type: Number },
        name: { type: String },
        parentCategoryID: { type: Number },
      },
    ],
    seo: {
      title: { type: String },
      description: { type: String },
      cronicalUrl: { type: String },
    },
    attributes: [
      {
        attributeName: { type: String },
        attributeValues: [{ type: String }]
      },
    ],
    ampSlug: { type: String },
    totalQuantity: { type: Number },
    stock: { type: Number, default: "" },
    termsAndConditions: { type: String },
    tags: { type: Array },
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date, default: Date.now() },
    isPublish: { type: String },
    searchEngineTitle: { type: String },
    searchEngineDescription: { type: String },
    status: { type: Number, default: 1 },
    createdBy: { type: Number },
    modifiedBy: { type: Number },
    createdDate: { type: Date, default: Date.now() },
    modifiedDate: { type: Date, default: Date.now() },
    variants: [{
      variant: { type: String },
      price: { type: Number },
      quantity: { type: Number },
      sku: { type: Number }
    }],
    productCost: { type: Number },
  },

  {
    timestamps: true,
  }
);

ProductSchema.plugin(autoIncrement.plugin, {
  model: "products",
  field: "ID",
  startAt: 100,
});
module.exports = mongoose.model("products", ProductSchema);
