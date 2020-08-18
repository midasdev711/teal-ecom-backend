/*
  * CreatedBy : Ankita Solace
  * CreatedDate : 29-11-2019
  * Purporse :  article schema
*/
const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  SchemaType = Schema.Types,
  autoIncrement = require('mongoose-auto-increment');
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
  Article_SEO: [{ MetaTitle: String, MetaDescription: String, KeyPhrases: String, ConicalUrl: String }],
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
    ID: Number, Name: String,
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
    if (userId && !articlesId.length) {
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
    if (articlesId) {
      query = { _id: { $in: articlesId } };
    }
    return this.find(query);
  }
}

ArticleSchema.loadClass(Article);



ArticleSchema.plugin(autoIncrement.plugin, { model: 'articles', field: 'ID', startAt: 1 });
ArticleSchema.plugin(autoIncrement.plugin, { model: 'articles', field: 'Sequence', startAt: 1 });
module.exports = mongoose.model('articles', ArticleSchema);
