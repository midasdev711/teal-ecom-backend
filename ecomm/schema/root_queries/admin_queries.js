
const AdminCatgory = require('../../models/admin');
const { AdminType } = require('../types/admin_constant');
const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt }= require('graphql');
const { GraphQLEmail } = require('graphql-custom-types');
const { verifyToken } = require('../middleware/middleware');



/**
    * get admin list
    * @param {$Search} keyword
    * @returns {attributelist Array}
    */

const AdminCategoryAll = {
  type: new GraphQLList(AdminType),
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    return AdminCatgory.find({}); }
};




const AdminArray = { AdminCategoryAll  };
module.exports = AdminArray;
