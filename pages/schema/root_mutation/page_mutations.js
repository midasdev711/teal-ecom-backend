/*
  * Created By : Ankita Solace
  * Created Date : 03-12-2019
  * Purpose : Declare all article schema methods
*/

const Page = require('../../models/pages'),
      { CategoryType } = require('../types/page_constant'),
      { GraphQLInt, GraphQLString } = require('graphql'),
      { verifyToken } = require('../middleware/middleware');

// add page
const AddPage = {
  type : CategoryType,
  args : {
    PageTitle : { type: GraphQLString },
    PageDescription : { type: GraphQLString },
    PageUserID : { type: GraphQLInt },
    PageCategory: { type: GraphQLString},
    PageUserName: { type: GraphQLString},
    PageEmail: { type: GraphQLString },
    PagePhone: { type: GraphQLString },
    PageWebsite: { type: GraphQLString },
    PageLocation: { type: GraphQLString },
    PageUserID: { type: GraphQLInt }
  },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    let PageData = new Categories({
      PageTitle: args.title,
      PageDescription: args.description,
      PageUserID: args.user_id,
      PageCategory: args.category,
      PageUserName: args.username,
      PagePhone: args.phone,
      PageWebsite: args.website,
      PageLocation: args.location,

    });
    return PageData.save();
  }
};

const PageArray = { AddPage , GetPage };
module.exports = PageArray;


