
const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const ProductCategorySchema = new Schema({
    ID: { type: Number, required: true, exists: false, unique: true },
    name: { type: String, required: true, exists: false, unique: true },
    description: { type: String },
    sequence: { type: Number },
    featureImage: { type: String },
    slug: { type: String, required: true, exists: false, unique: true },
    isParent: { type: Boolean },
    parentCategoryID: { type: Number, required: true, default: 0 },
    status: { type: Number, default: 1 },
    type: { type: Number, enum: [1, 2], default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
    createdBy: { type: Number, default: 1 },
    modifiedBy: { type: Number, default: 1 }
});

ProductCategorySchema.plugin(autoIncrement.plugin, { model: 'product_category', field: 'ID', startAt: 1 });
ProductCategorySchema.plugin(autoIncrement.plugin, { model: 'product_category', field: 'sequence', startAt: 1 });
class Category {
    static async getCategories({ args }) {
        const { ids: categoryIds } = args;

        if (categoryIds) {
            return this.find({ _id: { $in: categoryIds } });
        }
    }
}

ProductCategorySchema.loadClass(Category);
module.exports = mongoose.model('product_category', ProductCategorySchema);

