/*
  * Created By : Ankita Solace
  * Created Date : 11-12-2019
  * Purpose : Declare all article bookmarks schema methods
*/

const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt,GraphQLNonNull } = require('graphql'),
      Bookmarks = require('../../models/bookmarks'),
      { ArticleBookmarkType } = require('../types/constant'),
      { verifyToken } = require('../middleware/middleware');

  // add and remove bookmark using same api
  const AddBookmark= {
      type: ArticleBookmarkType,
      args : {
        ArticleID: { type: new GraphQLNonNull(GraphQLInt) },
        UserID: { type: GraphQLInt }
      },
      resolve: async (parent, args, context) => {
        const id = await verifyToken(context);
        var object = {};
        if(id.UserID) args.UserID = id.UserID

        if(typeof args.UserID != "undefined" && args.UserID != 0 ) {
            let BookmarkConstant = new Bookmarks({ ArticleID: args.ArticleID,UserID: args.UserID });

            return Bookmarks.findOne({$and: [{  ArticleID: args.ArticleID },{ UserID: args.UserID },{Status:1}]})
            .then(result => {
                if(result == null) return BookmarkConstant.save();
                else {
                    return Bookmarks.findOneAndUpdate({
                        ArticleID: args.ArticleID,UserID: args.UserID,Status:1 },
                        {$set : { Status : 0 }},
                        { new: true, returnNewDocument: true })
                }
            })
            .catch(err => {return err})
        } else throw new Error("Please login to continue");
      }
  };

// remove bookmark call from other page
  const RemoveBookmark= {
    type: ArticleBookmarkType,
      args : {
        ArticleID: { type: new GraphQLNonNull(GraphQLInt) },
        UserID: { type: GraphQLInt }
      },
      resolve: async (parent, params, context) => {
        const id = await verifyToken(context);
        if(id.UserID) params.UserID = id.UserID
        if(typeof args.UserID != "undefined" && args.UserID != 0 ) {
            return Bookmarks.findOneAndUpdate({  ArticleID: params.ArticleID,UserID: params.UserID,Status: 1 }, {$set : { Status : 0 }},{ new: true, returnNewDocument: true })
        } else throw new Error("Please login to continue");
      }
  };


  const BookmarkArray = { AddBookmark,RemoveBookmark };
  module.exports = BookmarkArray;
