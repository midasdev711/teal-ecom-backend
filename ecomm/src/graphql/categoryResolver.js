const { verifyToken } = require("../controllers/authController");
// const { ArticleStatusConst } = require("../constant");
const ProductCategory = require("../models/product_category");
const get = require("lodash/get");
const UploadBase64OnS3 = require('../../../upload/base64_upload'),
    { AWSCredentails } = require('../../../upload/aws_constants');
module.exports = {
    index: async (root, args, context) => {
        if (context.userAuthenticate) {
            if (context.apiKey) {
                let arr = context.apiKey.split("_");
                args.UserID = arr[1];
            } else {
                args.UserID = null;
            }
        }
        const findQuery = await buildFindQuery({
            args: args.filters,
        });
        let data = await ProductCategory.find(findQuery);
        return data;
    },
    upsert: async (root, args, context) => {
        // let attributes = get(args, "productCategory");
        console.log(args.category)
        let category = await ProductCategory.findOne({ ID: args.category.ID });
        if (category) {
            if (category.parentCategoryID === 0 && args.category.parentCategoryID === 0) {
                args.category.ParentCategoryID = 0;
                args.category.isParent = false;
                let updateObj = {}
                updateObj.name = args.category.Name;
                updateObj.description = args.category.Description;
                updateObj.slug = args.category.Slug;
                updateObj.featureImage = args.category.FeatureImage;
                updateObj.parentCategoryID = args.category.ParentCategoryID;
                updateObj.sequence = args.category.Sequence;
                updateObj.type = args.category.Type;
                return await ProductCategory.findOneAndUpdate({ ID: args.ID }, { $set: updateObj }, { new: true })
            }
        } else {
            let base64Str;
            let imagePath;
            if (args.category.FeatureImage) {
                base64Str = args.FeatureImage;
                imagePath = await UploadBase64OnS3(args.category.FeatureImage, AWSCredentails.AWS_PRODUCT_THUMBNAIL);
                args.category.FeatureImage = imagePath;
            }

            if (args.category.ParentCategoryID !== 0 && args.category.ParentCategoryID) {
                await ProductCategory.findOneAndUpdate({ ID: args.category.ParentCategoryID }, { $set: { isParent: true } }, { new: true });
            }

            if ((args.category.isParent === undefined || args.category.isParent === null)) {
                args.category.isParent = true;
            }
            let categoryObj = {};
            categoryObj.name = args.category.Name;
            categoryObj.description = args.category.Description;
            categoryObj.slug = args.category.Slug;
            categoryObj.featureImage = args.category.FeatureImage;
            categoryObj.parentCategoryID = args.category.ParentCategoryID;
            categoryObj.sequence = args.category.Sequence;
            categoryObj.type = args.category.Type;
            return ProductCategory.create(categoryObj);
        }
    },

    getCategory: async (root, args, context) => {
        let category = await ProductCategory.findOne({ "ID": args.ID });
        if (category !== null) {
            return category;
        }
    },
    getParentCategories: async (root, args, context) => {
        let data = await ProductCategory.find({ isParent: true });
        return data;
    },
    getSubCategory: async (root, args, context) => {
        let subCategories = await ProductCategory.find({ parentCategoryID: args.ID });
        if (subCategories) {
            return subCategories;
        }
    },

    removeCategory: async (root, args, context) => {
        let set = { set: { Status: 0 } }
        let removeCategory = await ProductCategory.findOneAndUpdate({ ID: args.ID }, set, { new: true });
        return removeCategory;
    }


};

const buildFindQuery = async ({ args, UserID }) => {
    let query = { $and: [] };

    query.$and.push({ status: 1 });

    if (get(args, "categoryIds")) {
        query.$and.push({ ID: { $in: get(args, "categoryIds") } });
    }

    if (get(args, "ignoreCategoryIds")) {
        query.$and.push({ ID: { $nin: get(args, "ignoreCategoryIds") } });
    }

    return query;
};
