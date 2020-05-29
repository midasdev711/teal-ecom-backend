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
    * get User List with pagination and search
    * @param {$limitl} email
    * @param {$skip}  password
    * @returns {userlist Array}
    */

const UserCategoryWithPagination = {
  type: new GraphQLList(UserType),
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
          return Users.find({ Status: 1 }).sort({_id: -1});
       }else if (args.Search == undefined){
          return Users.find({ Status: 1 }).sort({_id: -1}).skip(offset).limit(limit);
       }else{
         return Users.find({ $or: [
                                   { Name:{$regex: args.Search },Status :1},
                                   { Email:{$regex: args.Search } ,Status :1 },
                                            ]
                  }).sort({_id: -1}).skip(offset).limit(limit);
       }
    }
};



/**
    * get User List with search
    * @param {$limitl} email
    * @param {$skip}  password
    * @returns {userlist Array}
    */

const UserCategoryAll = {
  type: new GraphQLList(UserType),
  args: {
         Search: {type: GraphQLString },
    },
  resolve: async (parent, args, context) => {
     const id = await verifyToken(context);
     if(args.Search == undefined ){
        return Users.find({ Status: 1 }).sort({_id: -1});
     }else{
          return Users.find({ $or: [
                              { Name:{$regex: args.Search },Status :1},
                              { Email:{$regex: args.Search } ,Status :1 },

                             ]
                }).sort({_id: -1});
       }
    }
};


/**
    * get User details by user id
    * @param {$_id} userid
    * @returns {userlist Array}
    */

const UserDetailByID = {
  type: new GraphQLList(UserType),
  args: { _id: {type: GraphQLString } },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    return Users.find({ _id: args._id }); }
};


const UserArray = {  UserCategoryWithPagination , UserCategoryAll , UserDetailByID };

module.exports = UserArray;
