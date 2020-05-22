/*
  * Created By : Ankita Solace
  * Created Date : 12-12-2019
  * Purpose : Declare all bookmark root queries schema methods
*/

const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt } = require('graphql'),
      Bookmarks = require('../../models/bookmarks'),
      { ArticleBookmarkType } = require('../types/constant');

    // get all bookmarks
    const GetAllBookmarks = {
      type: new GraphQLList(ArticleBookmarkType),
      args: {  UserID: { type: GraphQLInt } },
      resolve(parent, args) { return Bookmarks.find({$and: [{ UserID: args.UserID },{Status:1}]}); }
    };

  const BookMarkArray = { GetAllBookmarks };
  module.exports = BookMarkArray;
