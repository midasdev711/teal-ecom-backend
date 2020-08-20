const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const CategoriesSchema = new Schema({
  ID: { type: Number, required: true, exists: false, unique: true },
  Name: { type: String, required: true, exists: false, unique: true },
  Description: String,
  Sequence: Number,
  FeatureImage: String,
  Slug: { type: String, required: true, exists: false, unique: true },
  isParent: Boolean,
  ParentCategoryID: { type: Number, required: true, default: 0 },
  Status: { type: Number, default: 1 },
  Type: { type: Number, enum: [1, 2], default: 1 },
  CreatedDate: { type: Date, default: Date.now },
  ModifiedDate: { type: Date, default: Date.now },
  CreatedBy: { type: Number, default: 1 },
  ModifiedBy: { type: Number, default: 1 },
});

CategoriesSchema.plugin(autoIncrement.plugin, {
  model: "categories",
  field: "ID",
  startAt: 1,
});
CategoriesSchema.plugin(autoIncrement.plugin, {
  model: "categories",
  field: "Sequence",
  startAt: 1,
});

class Category {
  static async getCategories({ args }) {
    const { ids: categoryIds } = args;

    if (categoryIds) {
      return this.find({ _id: { $in: categoryIds } });
    }
  }
}

CategoriesSchema.loadClass(Category);
module.exports = mongoose.model("categories", CategoriesSchema);