/*
  * Created By : Ankita Solace
  * Created Date : 16-12-2019
  * Purpose : Declare all roles schema methods
*/

const graphql = require('graphql');
const Roles = require('../../models/roles');
const { RoleType } = require('../types/constant');
const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString } = graphql;

  const AddRole = {
    type : RoleType,
    args : {
        Name: { type: GraphQLString },
        Description: { type: GraphQLString }
    },
    resolve(parent, args) {
        let RoleConstant = new Roles({
                Name: args.Name,
                Description: args.Description
        });
        return RoleConstant.save();
    }
  };

  const DeleteRole = {
    type : RoleType,
    args : {
        ID: { type: GraphQLID }
    },
    resolve(root, params) {
        return Roles.update(
            { ID: params.ID },
            { $set: { Status: 0 } },
            { new: true }
        )
        .catch(err => new Error(err));
      }
  };

  const UpdateRole = {
    type : RoleType,
    args : {
        ID: { type: GraphQLID },
        Name: { type: GraphQLString },
        Description: { type: GraphQLString },
        Status: { type: GraphQLID }
    },
    resolve(root, params) {
      if(params.Name == "") delete params.Name;
      if(params.Description == "") delete params.Description;
      if(params.Status == "") delete params.Status;

        return Roles.updateOne(
            { ID: params.ID },
            params,
            { new: true }
        )
        .catch(err => new Error(err));
      }
  };



  const RoleArray = { AddRole, DeleteRole,UpdateRole };
  module.exports = RoleArray;
