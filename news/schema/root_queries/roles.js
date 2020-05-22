/*
  * Created By : Ankita Solace
  * Created Date : 14-12-2019
  * Purpose : Declare all role schema methods
*/

const graphql = require('graphql'),
      Roles = require('../../models/roles'),
      schemaArray = require('../types/constant'),
      { RoleType } = schemaArray,
      { GraphQLID,GraphQLList , GraphQLString } = graphql;

// get roles by id
  const Role = {
    type: new GraphQLList(RoleType),
    args: { ID: { type: GraphQLID } },
    resolve(parent, args) { return Roles.find({ ID:args.ID }); }
  };

// get all roles
  const RoleAll = {
    type: new GraphQLList(RoleType),
    resolve(parent, args) {  return Roles.find({Status: 1 }); }
  };


  module.exports = { Role , RoleAll };
