const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const UserCategorySchema = new Schema(
  {
    ID: { type: Number, required: true, exists: false, unique: true },
    categoryID: { type: Array, required: true },
    userID: { type: Number, required: true },
    status: { type: Number, default: 1 },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

UserCategorySchema.plugin(autoIncrement.plugin, {
  model: "user_categories",
  field: "ID",
  startAt: 1,
});
module.exports = mongoose.model("user_categories", UserCategorySchema);
