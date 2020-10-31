/*
  * Created By : Ankita Solace
  * Created Date : 03-12-2019
  * Purpose : Declare all article schema methods
*/

const Customer = require('../../models/customers'),
  { CustomerType } = require('../types/customer_constant'),
  { GraphQLInt, GraphQLID, GraphQLList, GraphQLString, GraphQLBoolean, GraphQLObjectType } = require('graphql'),
  { verifyToken } = require('../middleware/middleware');

// add customer
const AddCustomer = {
  type: CustomerType,
  args: {
    BasicDetailsFirstName: { type: GraphQLString },
    BasicDetailsLastName: { type: GraphQLString },
    BasicDetailsEmail: { type: GraphQLString },
    BasicDetailsMobile: { type: GraphQLString },
    BasicDetailsEmailFlag: { type: GraphQLBoolean },


    AddressDetailsFirstName: { type: GraphQLString },
    AddressDetailsLastName: { type: GraphQLString },
    AddressDetailsCompany: { type: GraphQLString },
    AddressDetailsApartment: { type: GraphQLString },
    AddressDetailsCity: { type: GraphQLString },
    AddressDetailsCountry: { type: GraphQLString },
    AddressDetailsPostalCode: { type: GraphQLString },
    AddressDetailsMobile: { type: GraphQLString },
    Tax: { type: GraphQLFloat },
    Notes: { type: GraphQLString },
    Tags: { type: GraphQLString }
  },
  resolve: async (parent, args, context) => {
    let CustomerData = new Customers({
      BasicDetailsFirstName: args.BasicDetailsFirstName,
      BasicDetailsLastName: args.BasicDetailsLastName,
      BasicDetailsEmail: args.BasicDetailsEmail,
      BasicDetailsMobile: args.BasicDetailsMobile,
      BasicDetailsEmailFlag: args.BasicDetailsEmailFlag,
      AddressDetailsFirstName: args.AddressDetailsFirstName,
      AddressDetailsLastName: args.AddressDetailsLastName,
      AddressDetailsCompany: args.AddressDetailsCompany,
      AddressDetailsApartment: args.AddressDetailsApartment,
      AddressDetailsCity: args.AddressDetailsCity,
      AddressDetailsCountry: args.AddressDetailsCountry,
      AddressDetailsPostalCode: args.AddressDetailsPostalCode,
      AddressDetailsMobile: args.AddressDetailsMobile,
      Tax: args.Tax,
      Notes: args.Notes,
      Tags: args.Tags
    });
console.log('222222222222222222')
    return await CustomerData.save();
  }
};

// delete category
//   const DeleteArticleCategory = {
//    type : CategoryType,
//    args : {
//        ID: { type: GraphQLID }
//    },
//    resolve: async (parent, params, context) => {
//       const id = await verifyToken(context);
//       return Categories.update(
//           { ID: params.ID },
//           { $set: { Status: 0 } },
//           { new: true }
//       )
//       .catch(err => new Error(err));
//     }
//  };

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

const CustomerArray = { AddCustomer, GetCustomers };
module.exports = CustomerArray;
