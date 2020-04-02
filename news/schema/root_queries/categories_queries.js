/*
  * Created By : Ankita Solace
  * Created Date : 14-12-2019
  * Purpose : Declare all article category schema methods
*/


const ArticleCatgory = require('../../models/categories');
const { CategoryType } = require('../types/constant');
const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt }= require('graphql');

  const ArticleByID = {
    type: new GraphQLList(CategoryType),
    args: { ID: { type: GraphQLID } },
    resolve(parent, args){ return ArticleCatgory.find({ ID:args.ID }); }
  };

  const ArticleCategoryAll = {
    type: new GraphQLList(CategoryType),
    resolve(parent, args) { return ArticleCatgory.find({ Status: 1 }); }
  };

  const getParentCategories = {
    type :  new GraphQLList( CategoryType ),
    resolve( parent,args ){
      return ArticleCatgory.find({ isParent : true, Status : 1,ParentCategoryID:0 });
    }
  };

  const  GetCategoriesByIDs = {
      type :  new GraphQLList( CategoryType ),
      args : { IDs : { type: new GraphQLList( GraphQLInt ) } },
      resolve(root, params) {
        console.log(params.IDs );
        return ArticleCatgory.find({
             isParent : false,
             Status : 1,
             // ParentCategoryID:0,
             ParentCategoryID : { $in: params.IDs }
          });
      }
  };
  const CategoryArray = { ArticleByID, ArticleCategoryAll,getParentCategories,GetCategoriesByIDs };
  module.exports = CategoryArray;
