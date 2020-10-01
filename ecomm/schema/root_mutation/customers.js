/*
  * Created By : Ankita Solace
  * Created Date : 03-12-2019
  * Purpose : Declare all article schema methods
*/

const Customer = require('../../models/customers'),
      { CategoryType } = require('../types/customer_constant'),
      { GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean, GraphQLObjectType } = require('graphql'),
      { verifyToken } = require('../middleware/middleware');

  // add customer
  const AddCustomer = {
    type : CategoryType,
    args : {
        BasicDetails: { type: GraphQLObjectType },
        AddressDetails: { type: GraphQLObjectType },
        Tax: { type: GraphQLFloat },
        Notes : { type: GraphQLString },
        Tags : { type: GraphQLString }
    },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      let CustomerData = new Categories({
              BasicDetails: args.BasicDetails,
              AddressDetails: args.AddressDetails,
              Tax: args.Tax,
              Notes: args.Notes,
              Tags: args.Tags
      });
      return CustomerData.save();
    }
  };

  // delete category
  const DeleteArticleCategory = {
   type : CategoryType,
   args : {
       ID: { type: GraphQLID }
   },
   resolve: async (parent, params, context) => {
      const id = await verifyToken(context);
      return Categories.update(
          { ID: params.ID },
          { $set: { Status: 0 } },
          { new: true }
      )
      .catch(err => new Error(err));
    }
 };

// // update cateogry
//  const UpdateArticleCategory = {
//    type : CategoryType,
//    args : {
//        ID: { type: GraphQLInt },
//        Name: { type: GraphQLString },
//        Description: { type: GraphQLString },
//        Slug: { type: GraphQLString },
//        Status: { type: GraphQLID },
//        FeatureImage : { type: GraphQLString },
//        isParent : { type: GraphQLBoolean },
//        ParentCategoryID : { type: GraphQLInt },
//        Type : { type: GraphQLInt },
//    },
//    resolve: async (parent, params, context) => {
//       const id = await verifyToken(context);

//       return Categories.updateOne(
//           { ID: params.ID },
//           params,
//           { new: true }
//       )
//       .catch(err => new Error(err));
//     }
//  };

  const CustomerArray = { AddCustomer , GetCustomers };
  module.exports = CustomerArray;
