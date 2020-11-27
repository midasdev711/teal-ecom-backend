/*
  * Created By : Yashco System
  * Purpose : Created a graphQl modal
*/
//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaType = Schema.Types;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const OrderSchema = new Schema({
    ID : {  type: Number, required: true, exists: false, unique : true },
    userId: { type: Number },
    status: { type: Number, default: 1 },
    line_items: [
      {
        ID: { type: Number },
        merchantID: { type: Number },
        merchantName: { type: String },
        sku: { type: String, default: "" },
        title: { type: String },
        slug: { type: String },
        description: { type: String },
        mrp: { type: Number },
        salePrice: { type: Number },
        yourShippingCost: { type: Number },
        shippingCost: { type: Number },
        thumbnailImage: { type: String, default: "" },
        featuredImage: { type: String },
        images: [{ type: String }],
        category: { type: Number },
        subCategory: { type: Number },
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
        editStatus: { type: String },
        views: { type: Number, default: 0 },
        revenue: { type : String },
        searchEngineTitle: { type: String },
        searchEngineDescription: { type: String },
        status: { type: Number, default: 1 },
        createdBy: { type: Number },
        modifiedBy: { type: Number },
        createdDate: { type: Date, default: Date.now() },
        modifiedDate: { type: Date, default: Date.now() },
        weight: { type: Number },
        weightUnit: { type: String },
        name: { type: String },
        productCost: { type: Number },
        costPerItem: { type: Number },
        shippingRate: { type: Number },
        count: { type: Number }
      },
    ],
    fulfillment_status: { type: String },
    fullfillments: [
      {
        ID: { type: Number },
        merchantID: { type: Number },
        merchantName: { type: String },
        sku: { type: String, default: "" },
        title: { type: String},
        slug: { type: String },
        description: { type: String },
        mrp: { type: Number },
        salePrice: { type: Number },
        yourShippingCost: { type: Number },
        shippingCost: { type: Number },
        thumbnailImage: { type: String, default: "" },
        featuredImage: { type: String },
        images: [{ type: String }],
        category: { type: Number },
        subCategory: { type: Number },
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
        editStatus: { type: String },
        views: { type: Number, default: 0 },
        revenue: { type : String },
        searchEngineTitle: { type: String },
        searchEngineDescription: { type: String },
        status: { type: Number, default: 1 },
        createdBy: { type: Number },
        modifiedBy: { type: Number },
        costPerItem: { type: Number },
        createdDate: { type: Date, default: Date.now() },
        modifiedDate: { type: Date, default: Date.now() },
        weight: { type: Number },
        weightUnit: { type: String },
        name: { type: String },
        productCost: { type: Number },
        shippingRate: { type: Number },
        count: { type: Number }
      },
    ],
    orderAmount: { type: Number },
    customer: {
      ID: { type: Number, required: true },
      BasicDetailsFullName: { type: String,  required: true },
      BasicDetailsEmail: { type: String },
      BasicDetailsMobile: { type: String },
      AddressDetailsAddress: { type: String },
      AddressDetailsApartment: { type: String },
      AddressDetailsCity: { type: String },
      AddressDetailsCountry: { type: String },
      AddressDetailsPostalCode: { type: String },
      AddressDetailsState: { type: String },
    },
    paymentMethod: { type: String },
    transactionID: { type: String },
    createdDate: { type: Date, default: Date.now() },
    modifiedDate: { type: Date, default: Date.now() },
});


OrderSchema.plugin(autoIncrement.plugin, { model: 'orders', field: 'ID',startAt: 1 });
module.exports = mongoose.model('orders',OrderSchema );
