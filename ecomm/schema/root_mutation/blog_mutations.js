/*
  * Created By : Ankita Solace
  * Created Date : 03-12-2019
  * Purpose : Declare all article schema methods
*/

const Blog = require('../../models/blogs'),
      { CategoryType } = require('../types/blog_constant'),
      { GraphQLInt, GraphQLString } = require('graphql'),
      { verifyToken } = require('../middleware/middleware');

// add blog
const AddBlog = {
  type : CategoryType,
  args : {
    BlogTitle : { type: GraphQLString },
    BlogPublishingPlace : { type: GraphQLString }
    BlogCategory : { type: GraphQLString }
    BlogPicture : { type: GraphQLString }
    BlogUserID : { type: GraphQLInt }
    BlogPageID : { type: GraphQLString }
  },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    let BlogData = new Categories({
      BlogTitle: args.title,
      BlogPublishingPlace: args.publishing_place,
      BlogCategory: args.category,
      BlogPicture: args.picture,
      BlogUserID: args.user_id
      BlogPageID: args.page_id
    });


    console.log("args", args)

    return BlogData.save();
  }
};

const BlogArray = { AddBlog , GetBlogs };
module.exports = BlogArray;
