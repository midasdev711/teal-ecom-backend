/*
  * Created By : Ankita Solace
  * Created Date : 26-10-2019
  * Purpose : Declare all follow author schema methods
*/

const FollowAuthor = require('../../models/follow_author'),
      { FollowAuthorType } = require('../types/constant'),
      { GraphQLInt,GraphQLList } = require('graphql'),
      { verifyToken } = require('../middleware/middleware');

    // follow author list
  const FollowAuthorList = {
    type: new GraphQLList(FollowAuthorType),
    args: {
        UserID : { type : GraphQLInt },
        AuthorID : { type : GraphQLInt }
    },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      if( id.UserID ) args.UserID = id.UserID
       return FollowAuthor.find({ UserID:args.UserID,AuthorID:args.AuthorID, isFollowed : true, Status : 1 });
       }
  };


  module.exports  = { FollowAuthorList };
