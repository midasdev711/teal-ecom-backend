/*
  * Created By : Ankita Solace
  * Created Date : 18-12-2019
  * Purpose : Declare all bookmark root queries schema methods
*/

const graphql = require('graphql');
const Bookmarks = require('../../models/bookmarks');
const { ArticleBookmarkType } = require('../types/constant');
const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt } = graphql;

    const GetAllBookmarks = {
      type: new GraphQLList(ArticleBookmarkType),
      args: {  UserID: { type: GraphQLInt } },
      resolve(parent, args) { return Bookmarks.find({$and: [{ UserID: args.UserID },{Status:1}]}); }
    };

  const BookMarkArray = { GetAllBookmarks };
  module.exports = BookMarkArray;
