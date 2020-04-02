/*
  * Created By : Ankita Solace
  * Created Date : 14-12-2019
  * Purpose : Declare all role schema methods
*/

const graphql = require('graphql');
const Roles = require('../../models/roles');
const schemaArray = require('../types/constant');
const { RoleType } = schemaArray;
const { GraphQLID,GraphQLList , GraphQLString } = graphql;

  const Role = {
    type: new GraphQLList(RoleType),
    args: { ID: { type: GraphQLID } },
    resolve(parent, args) { return Roles.find({ ID:args.ID }); }
  };

  const RoleAll = {
    type: new GraphQLList(RoleType),
    resolve(parent, args) {  return Roles.find({Status: 1 }); }
  };

  const RoleArray = { Role , RoleAll };
  module.exports = RoleArray;
