/*
  * Created By : Ankita Solace
  * Created Date : 29-11-2019
  * Purpose : Declare all article category schema methods
*/


const ArticleCatgory = require('../../models/categories'),
      { CategoryType } = require('../types/constant'),
      { GraphQLID,GraphQLList , GraphQLInt }= require('graphql');

// get category by id
  const ArticleByCategoryID = {
    type: new GraphQLList(CategoryType),
    args: { ID: { type: GraphQLID } },
    resolve(parent, args){ return ArticleCatgory.find({ ID:args.ID }); }
  };

// get all article categories
  const ArticleCategoryAll = {
    type: new GraphQLList(CategoryType),
    resolve(parent, args) { return ArticleCatgory.find({ Status: 1 }); }
  };

  // get parent categories
  const GetParentCategories = {
    type :  new GraphQLList( CategoryType ),
    resolve( parent,args ){
      return ArticleCatgory.find({ isParent : true, Status : 1,ParentCategoryID:0 });
    }
  };

// get category by multiple ids
  const  GetCategoriesByIDs = {
      type :  new GraphQLList( CategoryType ),
      args : { IDs : { type: new GraphQLList( GraphQLInt ) } },
      resolve(root, params) {
        // console.log(params.IDs );
        return ArticleCatgory.find({
             isParent : false,
             Status : 1,
             ParentCategoryID : { $in: params.IDs }
          });
      }
  };
  
  module.exports = { ArticleByCategoryID, ArticleCategoryAll,GetParentCategories,GetCategoriesByIDs };
