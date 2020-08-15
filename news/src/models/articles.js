const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaType = Schema.Types;
const BlockAuthor = require("./block_author");

const autoIncrement = require("mongoose-auto-increment");
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

class Article {
  static async getArticles({ user, args }) {
    const userId = user.UserID;
    const { page, limit, ids: articleIds } = args;
    const option = {
      limit: limit || 10,
      page: page || 1,
      sort: {
        createdAt: -1,
      },
    };
    let query = {};
    if (userId && !articleIds.length) {
      const author = await BlockAuthor.find(
        { UserID: userId, Status: 0 },
        { AuthorID: 1, _id: 0 }
      );
      if (author.length > 0) {
        query = {
          AuthorID: { $nin: author.map((ID) => ID.AuthorID) },
          Status: 1,
          isPublish: true,
        };
      }
    }
    if (articleIds) {
      query = { _id: { $in: articleIds } };
    }
    return this.find(query);
  }
}

ArticleSchema.loadClass(Article);

module.exports = mongoose.model("articles", ArticleSchema);
