const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaType = Schema.Types;
const BlockAuthor = require("./block_author");

const autoIncrement = require("mongoose-auto-increment");
const mongoosePaginate = require("mongoose-paginate");
autoIncrement.initialize(mongoose);

const ArticleSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    title: { type: String, required: true },
    subTitle: { type: String },
    description: String,
    titleSlug: { type: String },
    slug: { type: String, required: true, exists: false, unique: true },
    sequence: Number,
    author: String,
    authorID: Number,
    article_SEO: [
      {
        metaTitle: String,
        metaDescription: String,
        keyPhrases: [String],
        conicalUrl: String,
      },
    ],
    ampSlug: String,
    imagePath: String,
    featureImage: String,
    thumbnail: String,
    readMinutes: String,
    tags: Array,
    totalClapCount: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    isDraft: { type: Boolean, default: false },
    isPublish: Boolean,
    isBookmark: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    categories: {
      ID: Number,
      name: String,
      subCategories: [{ ID: Number, Name: String }],
    },
    acceptDonation: { type: Boolean, default: false },
    minimumDonationAmount: { type: SchemaType.Decimal128, default: "0.00" },
    // isPaidSubscription : { type : Boolean, default : false },
    articleScope: { type: Number, default: 0 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
    createdBy: Number,
    modifiedBy: Number,
    urls: { type: String, default: "" },
    metaRobots:
    {
      type: String,
      enum: ['index,follow', 'index,nofollow', 'noindex,follow', 'noindex,nofollow'],
      default: 'index,follow'
    },
    internalArticle: { type: Boolean, default: false },
    descriptionJson: { type: Object }
  },
  {
    timestamps: true,
  }
);

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
