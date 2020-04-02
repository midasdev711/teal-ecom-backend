
const AdminCatgory = require('../../models/admin');
const { AdminType } = require('../types/admin_constant');
const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt }= require('graphql');
const { GraphQLEmail } = require('graphql-custom-types');




/**
    * get admin list
    * @param {$Search} keyword
    * @returns {attributelist Array}
    */

const AdminCategoryAll = {
  type: new GraphQLList(AdminType),
  resolve(parent, args) { return AdminCatgory.find({}); }
};




const AdminArray = { AdminCategoryAll  };
module.exports = AdminArray;
