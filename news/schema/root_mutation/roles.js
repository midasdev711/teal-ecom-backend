/*
  * Created By : Ankita Solace
  * Created Date : 16-12-2019
  * Purpose : Declare all roles schema methods
*/

const graphql = require('graphql'),
      Roles = require('../../models/roles'),
      { RoleType } = require('../types/constant'),
      { GraphQLInt,GraphQLID,GraphQLList , GraphQLString } = graphql,
      { verifyToken } = require('../middleware/middleware');

  // add user roles
  const AddRole = {
    type : RoleType,
    args : {
        Name: { type: GraphQLString },
        Description: { type: GraphQLString }
    },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
        let RoleConstant = new Roles({
                Name: args.Name,
                Description: args.Description
        });
        return RoleConstant.save();
    }
  };

  // delete roles
  const DeleteRole = {
    type : RoleType,
    args : { ID: { type: GraphQLID } },
    resolve: async (parent, params, context) => {
      const id = await verifyToken(context);
        return Roles.update({ ID: params.ID }, { $set: { Status: 0 } },{ new: true })
               .catch(err => new Error(err));
      }
  };

  //edit roles
  const UpdateRole = {
    type : RoleType,
    args : {
        ID: { type: GraphQLID },
        Name: { type: GraphQLString },
        Description: { type: GraphQLString },
        Status: { type: GraphQLID }
    },
    resolve: async (parent, params, context) => {
      const id = await verifyToken(context);
      if(params.Name == "") delete params.Name;
      if(params.Description == "") delete params.Description;
      if(params.Status == "") delete params.Status;

        return Roles.updateOne({ ID: params.ID }, params, { new: true })
               .catch(err => new Error(err));
      }
  };



  const RoleArray = { AddRole, DeleteRole,UpdateRole };
  module.exports = RoleArray;
