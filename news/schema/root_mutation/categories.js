/*
  * Created By : Ankita Solace
  * Created Date : 16-12-2019
  * Purpose : Declare all article schema methods
*/

const Categories = require('../../models/categories');
const { CategoryType } = require('../types/constant');
const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean } = require('graphql');

  const AddArticleCategory = {
    type : CategoryType,
    args : {
        Name: { type: GraphQLString },
        Description: { type: GraphQLString },
        Slug: { type: GraphQLString },
        FeatureImage : { type: GraphQLString },
        isParent : { type: GraphQLBoolean },
        ParentCategoryID : { type: GraphQLInt }
    },
    resolve(parent, args) {
        let ArticleCategoryConstant = new Categories({
                Name: args.Name,
                Description: args.Description,
                Slug: args.Slug,
                FeatureImage: args.FeatureImage,
                isParent: args.isParent,
                ParentCategoryID: args.ParentCategoryID
        });
        return ArticleCategoryConstant.save();
    }
  };

  const DeleteArticleCategory = {
    type : CategoryType,
    args : {
        ID: { type: GraphQLID }
    },
    resolve(root, params) {
        return Categories.update(
            { ID: params.ID },
            { $set: { Status: 0 } },
            { new: true }
        )
        .catch(err => new Error(err));
      }
  };

  const UpdateArticleCategory = {
    type : CategoryType,
    args : {
        ID: { type: GraphQLInt },
        Name: { type: GraphQLString },
        Description: { type: GraphQLString },
        Slug: { type: GraphQLString },
        Status: { type: GraphQLID },
        FeatureImage : { type: GraphQLString },
        isParent : { type: GraphQLBoolean },
        ParentCategoryID : { type: GraphQLInt }
    },
    resolve(root, params) {
      if(params.Name == "") delete params.Name;
      if(params.Description == "") delete params.Description;
      if(params.Slug == "") delete params.Slug;
      if(params.Status == "") delete params.Status;
      if(params.FeatureImage == "") delete params.FeatureImage;
      if(params.isParent == "") delete params.isParent;
      if(params.ParentCategoryID == "") delete params.ParentCategoryID;

        return Categories.updateOne(
            { ID: params.ID },
            params,
            { new: true }
        )
        .catch(err => new Error(err));
      }
  };


  const CategoryArray = { AddArticleCategory, DeleteArticleCategory,UpdateArticleCategory };
  module.exports = CategoryArray;
