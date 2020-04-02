/*
  * Created By : Ankita Solace
  * Created Date : 18-12-2019
  * Purpose : Declare all article bookmarks schema methods
*/

const graphql = require('graphql');
const Bookmarks = require('../../models/bookmarks');
const { ArticleBookmarkType } = require('../types/constant');
const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt,GraphQLNonNull

 } = graphql;

  const AddBookmark= {
      type: ArticleBookmarkType,
      args : {
        ArticleID: { type: new GraphQLNonNull(GraphQLInt) },
        UserID: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
          let BookmarkConstant = new Bookmarks({ ArticleID: args.ArticleID,UserID: args.UserID });
          return Bookmarks.findOne({$and: [{  ArticleID: args.ArticleID },{ UserID: args.UserID },{Status:1}]})
            .then(result => {
                if(result == null) {   return BookmarkConstant.save(); }
                else {
                  return Bookmarks.deleteOne( {  ArticleID: args.ArticleID,UserID: args.UserID,Status:1 });
                  }
            })
            .catch(err => {return err})
      }
  };

  const RemoveBookmark= {
    type: ArticleBookmarkType,
      args : {
        ArticleID: { type: new GraphQLNonNull(GraphQLInt) },
        UserID: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(root, params) {
        return Bookmarks.deleteOne( {  ArticleID: params.ArticleID,UserID: params.UserID,Status:1 });
      }
  };


  const BookmarkArray = { AddBookmark,RemoveBookmark };
  module.exports = BookmarkArray;
