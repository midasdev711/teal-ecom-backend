/*
  * Created By : Ankita Solace
  * Created Date : 29-11-2019
  * Purpose : Declare all article category schema methods
*/


const ArticleCatgory = require('../../models/categories'),
      { CategoryType } = require('../types/constant'),
      { GraphQLID,GraphQLList , GraphQLInt }= require('graphql'),
      { verifyToken } = require('../middleware/middleware');

// get category by id
  const ArticleByCategoryID = {
    type: new GraphQLList(CategoryType),
    args: { ID: { type: GraphQLID } },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      return ArticleCatgory.find({ ID:args.ID }); }
  };

// get all article categories
  const ArticleCategoryAll = {
    type: new GraphQLList(CategoryType),
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      return ArticleCatgory.find({ Status: 1 }); }
  };

  // get parent categories
  const GetParentCategories = {
    type :  new GraphQLList( CategoryType ),
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      return ArticleCatgory.find({ isParent : true, Status : 1,ParentCategoryID:0 });
    }
  };

// get category by multiple ids
  const  GetCategoriesByIDs = {
      type :  new GraphQLList( CategoryType ),
      args : { IDs : { type: new GraphQLList( GraphQLInt ) } },
      resolve: async (root, params, context) => {
        const id = await verifyToken(context);
        // console.log(params.IDs );
        return ArticleCatgory.find({
             isParent : false,
             Status : 1,
             ParentCategoryID : { $in: params.IDs }
          });
      }
  };

  const GetCategoryByType = {
    type : new GraphQLList( CategoryType ),
    args : { Type : { type : GraphQLInt } },
    resolve: async (parent, args, context) => {
      // const id = await verifyToken(context);
      return ArticleCatgory.find({ Type : args.Type, isParent : true, Status : 1,ParentCategoryID:0})
    }
  };

  module.exports = { GetCategoryByType, ArticleByCategoryID, ArticleCategoryAll,GetParentCategories,GetCategoriesByIDs };
