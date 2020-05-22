/*
  * Created By : Ankita Solace
  * Created Date : 11-12-2019
  * Purpose : Declare all article bookmarks schema methods
*/

const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt,GraphQLNonNull } = require('graphql'),
      Bookmarks = require('../../models/bookmarks'),
      { ArticleBookmarkType } = require('../types/constant');

  // add and remove bookmark using same api
  const AddBookmark= {
      type: ArticleBookmarkType,
      args : {
        ArticleID: { type: new GraphQLNonNull(GraphQLInt) },
        UserID: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        var object = {};
          let BookmarkConstant = new Bookmarks({ ArticleID: args.ArticleID,UserID: args.UserID });
          return Bookmarks.findOne({$and: [{  ArticleID: args.ArticleID },{ UserID: args.UserID },{Status:1}]})
            .then(result => {
                if(result == null) {   return BookmarkConstant.save(); }
                else {
                  return Bookmarks.findOneAndUpdate({  ArticleID: args.ArticleID,UserID: args.UserID,Status:1 },
                    {$set : { Status : 0 }},{ new: true, returnNewDocument: true }
                  )
                   // Bookmarks.deleteOne( {  ArticleID: args.ArticleID,UserID: args.UserID,Status:1 });
                   // return [];
                  }
            })
            .catch(err => {return err})
      }
  };

// remove bookmark call from other page
  const RemoveBookmark= {
    type: ArticleBookmarkType,
      args : {
        ArticleID: { type: new GraphQLNonNull(GraphQLInt) },
        UserID: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(root, params) {
        return Bookmarks.findOneAndUpdate({  ArticleID: params.ArticleID,UserID: params.UserID,Status: 1 },
          {$set : { Status : 0 }},{ new: true, returnNewDocument: true }
        )
        // return Bookmarks.deleteOne( {  ArticleID: params.ArticleID,UserID: params.UserID,Status:1 });
      }
  };


  const BookmarkArray = { AddBookmark,RemoveBookmark };
  module.exports = BookmarkArray;
