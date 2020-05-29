const AdminCatgory = require('../../models/admin');
const { AdminType } = require('../types/admin_constant');
const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt }= require('graphql');
const { GraphQLEmail } = require('graphql-custom-types');
const Users = require('../../../news/models/users');
const { UserType } = require('../../../news/schema/types/constant');
const Categories = require('../../../news/models/categories');
const { CategoryType } = require('../../../news/schema/types/constant');
const { verifyToken } = require('../middleware/middleware');


/**
    * get Category list with search by keyword
    * @param {$Search} keyword
    * @returns {categorylist Array}
    */

const AllProductCategoryList = {
  type: new GraphQLList(CategoryType),
  args: {
         Search: {type: GraphQLString },
    },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
     if(args.Search == undefined ){
        return Categories.find({ ParentCategoryID: 0 ,isParent:true , Status: 1 }).sort({_id: -1});
     }else{
          return Categories.find({ $or: [
                              { Name:{$regex: args.Search }, ParentCategoryID: 0 ,isParent:true , Status: 1 }
                             ]
                }).sort({_id: -1});
       }
    }
};



/**
    * get SubCategory list with search & pagination
    * @param {$limitl} limit
    * @param {$skip}  skip
    * @param {$Search} keyword
    * @returns {categorylist Array}
    */

const AllProductCategoryListWithPagination = {
  type: new GraphQLList(CategoryType),
  args: {
        Limit: {type: GraphQLInt },
        Skip:  {type: GraphQLInt },
        Search: {type: GraphQLString }
    },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    const limit = args.Limit;
    const offset = limit * (args.Skip-1);
       if(limit == undefined){
          return Categories.find({ ParentCategoryID: 0 ,isParent:true ,Status: 1}).sort({_id: -1});
       }else if (args.Search == undefined){
          return Categories.find({ ParentCategoryID: 0 ,isParent:true ,Status: 1}).sort({_id: -1}).skip(offset).limit(limit);
       }else{
         return Categories.find({ $or: [
                                    { Name:{$regex: args.Search },ParentCategoryID: 0 ,isParent:true , Status: 1 }
                                ]
                  }).sort({_id: -1}).skip(offset).limit(limit);
       }
    }
};


/**
    * get sub Category list
    * @param {$Search} keyword
    * @returns {categorylist Array}
    */

const AllProductSubCategoryList = {
  type: new GraphQLList(CategoryType),
  args: {
         Search: {type: GraphQLString },
         ID: { type: GraphQLInt }
    },
  resolve: async (parent, args, context) => {
     const id = await verifyToken(context);
     if(args.Search == undefined ){
        return Categories.find({ ParentCategoryID :args.ID , Status: 1 }).sort({_id: -1});
     }else{
          return Categories.find({ $or: [
                              { Name:{$regex: args.Search }, ParentCategoryID :args.ID , Status: 1 }
                             ]
                }).sort({_id: -1});
       }
    }
};


/**
    * get sub Category list
    * @param {$limitl} limit
    * @param {$skip}  skip
    * @param {$Search} keyword
    * @param {ID} categoryid
    * @returns {categorylist Array}
    */
const AllProductSubCategoryListWithPagination = {
  type: new GraphQLList(CategoryType),
  args: {
        Limit: {type: GraphQLInt },
        Skip:  {type: GraphQLInt },
        Search: {type: GraphQLString },
        ID: { type: GraphQLInt }
    },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    const offset = limit * (args.Skip-1);
       if(limit == undefined){
          return Categories.find({ ParentCategoryID :args.ID , Status: 1}).sort({_id: -1});
       }else if (args.Search == undefined){
          return Categories.find({ ParentCategoryID :args.ID ,  Status: 1 }).sort({_id: -1}).skip(offset).limit(limit);
       }else{
         return Categories.find({ $or: [
                                    { Name:{$regex: args.Search }, ParentCategoryID :args.ID , Status: 1 }
                                ]
                  }).sort({_id: -1}).skip(offset).limit(limit);
       }
    }
};


/**
    * get Category details by id
    * @param {ID} categoryid
    * @returns {categorylist Array}
    */

const CategoryDetailsByID = {
  type: new GraphQLList(CategoryType),
  args: {
         ID: { type: GraphQLInt }
    },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
         return Categories.find({ ID :args.ID , Status: 1 });
    }
};



const CategoryArray = { AllProductCategoryList, AllProductSubCategoryList,
  AllProductCategoryListWithPagination, AllProductSubCategoryListWithPagination ,
  CategoryDetailsByID };

module.exports = CategoryArray;
