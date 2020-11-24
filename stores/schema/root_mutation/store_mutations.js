/*
  * Created By : Ankita Solace
  * Created Date : 03-12-2019
  * Purpose : Declare all article schema methods
*/

const Store = require('../../models/stores'),
      { CategoryType } = require('../types/store_constant'),
      { GraphQLInt, GraphQLString } = require('graphql'),
      { verifyToken } = require('../middleware/middleware');

// add store
const AddStore = {
  type : CategoryType,
  args : {
    StoreTitle : { type: GraphQLString },
    StoreDescription : { type: GraphQLString },
    StoreUserID : { type: GraphQLInt },
    StoreCategory: { type: GraphQLString},
    StoreUserName: { type: GraphQLString},
    StoreEmail: { type: GraphQLString },
    StorePhone: { type: GraphQLString },
    StoreWebsite: { type: GraphQLString },
    StoreLocation: { type: GraphQLString },
    StoreUserID: { type: GraphQLInt },
    StorePageID: { type: GraphQLInt }
  },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    let StoreData = new Categories({
      StoreTitle: args.title,
      StoreDescription: args.description,
      StoreUserID: args.user_id,
      StoreCategory: args.category,
      StoreUserName: args.username,
      StoreEmail: args.email,
      StorePhone: args.phone,
      StoreWebsite: args.website,
      StoreLocation: args.location,
      StorePageID: { type: GraphQLInt }

    });
    return StoreData.save();
  }
};

const StoreArray = { AddStore , GetStore };
module.exports = StoreArray;


