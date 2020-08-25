const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const CategoriesSchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    name: { type: String, required: true, exists: false, unique: true },
    description: String,
    sequence: Number,
    featureImage: String,
    slug: { type: String, required: true, exists: false, unique: true },
    isParent: Boolean,
    parentCategoryID: { type: Number, required: true, default: 0 },
    status: { type: Number, default: 1 },
    type: { type: Number, enum: [1, 2], default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
    createdBy: { type: Number, default: 1 },
    modifiedBy: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

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
