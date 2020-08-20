const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaType = Schema.Types;
const BlockAuthor = require("./block_author");

const autoIncrement = require("mongoose-auto-increment");
const mongoosePaginate = require("mongoose-paginate");
autoIncrement.initialize(mongoose);

const ArticleSchema = new Schema({
  ID: { type: Number, required: true, exists: false, unique: true },
  Title: { type: String, required: true },
  SubTitle: { type: String },
  Description: String,
  TitleSlug: { type: String },
  Slug: { type: String, required: true, exists: false, unique: true },
  Sequence: Number,
  Author: String,
  AuthorID: Number,
  Article_SEO: [
    {
      MetaTitle: String,
      MetaDescription: String,
      KeyPhrases: String,
      ConicalUrl: String,
    },
  ],
  AmpSlug: String,
  ImagePath: String,
  FeatureImage: String,
  Thumbnail: String,
  ReadMinutes: String,
  Tags: Array,
  TotalClapCount: { type: Number, default: 0 },
  Status: { type: Number, default: 1 },
  isPublish: Boolean,
  isBookmark: { type: Boolean, default: false },
  ViewCount: { type: Number, default: 0 },
  Categories: {
    ID: Number,
    Name: String,
    SubCategories: [{ ID: Number, Name: String }],
  },
  AcceptDonation: { type: Boolean, default: false },
  MinimumDonationAmount: { type: SchemaType.Decimal128, default: "0.00" },
  // isPaidSubscription : { type : Boolean, default : false },
  ArticleScope: { type: Number, default: 0 },
  CreatedDate: { type: Date, default: Date.now },
  ModifiedDate: { type: Date, default: Date.now },
  CreatedBy: Number,
  ModifiedBy: Number,
  Urls: { type: String, default: "" },
});

class Article {
  update(attributes) {
    this.set(attributes);
    return this.save();
  }
}

ArticleSchema.loadClass(Article);

ArticleSchema.plugin(autoIncrement.plugin, {
  model: "articles",
  field: "ID",
  startAt: 1,
});
ArticleSchema.plugin(autoIncrement.plugin, {
  model: "articles",
  field: "Sequence",
  startAt: 1,
});
ArticleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("articles", ArticleSchema);