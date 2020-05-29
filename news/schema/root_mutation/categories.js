/*
  * Created By : Ankita Solace
  * Created Date : 03-12-2019
  * Purpose : Declare all article schema methods
*/

const Categories = require('../../models/categories'),
      { CategoryType } = require('../types/constant'),
      { GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean } = require('graphql'),
      { verifyToken } = require('../middleware/middleware');

  // add cateogry
  const AddArticleCategory = {
    type : CategoryType,
    args : {
        Name: { type: GraphQLString },
        Description: { type: GraphQLString },
        Slug: { type: GraphQLString },
        FeatureImage : { type: GraphQLString },
        isParent : { type: GraphQLBoolean },
        ParentCategoryID : { type: GraphQLInt },
        Type : { type: GraphQLInt },
    },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      let ArticleCategoryConstant = new Categories({
              Name: args.Name,
              Description: args.Description,
              Slug: args.Slug,
              FeatureImage: args.FeatureImage,
              isParent: args.isParent,
              ParentCategoryID: args.ParentCategoryID,
              Type : args.Type
      });
      return ArticleCategoryConstant.save();
    }
  };

  // delete category
  const DeleteArticleCategory = {
   type : CategoryType,
   args : {
       ID: { type: GraphQLID }
   },
   resolve: async (parent, params, context) => {
      const id = await verifyToken(context);
      return Categories.update(
          { ID: params.ID },
          { $set: { Status: 0 } },
          { new: true }
      )
      .catch(err => new Error(err));
    }
 };

// update cateogry
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
       ParentCategoryID : { type: GraphQLInt },
       Type : { type: GraphQLInt },
   },
   resolve: async (parent, params, context) => {
      const id = await verifyToken(context);

      return Categories.updateOne(
          { ID: params.ID },
          params,
          { new: true }
      )
      .catch(err => new Error(err));
    }
 };

  const CategoryArray = { AddArticleCategory , DeleteArticleCategory,UpdateArticleCategory };
  module.exports = CategoryArray;
