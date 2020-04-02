/*
  * Created By : Ankita Solace
  * Created Date : 26-10-2019
  * Purpose : Declare all follow author schema methods
*/

const FollowAuthor = require('../../models/follow_author');
const { FollowAuthorType } = require('../types/constant');
const { GraphQLInt,GraphQLList , GraphQLString, GraphQLBoolean } = require('graphql');


  const FollowUnFollowObject = {
    type: FollowAuthorType,
    args: {
            UserID: { type: GraphQLInt },
            AuthorID: { type: GraphQLInt },
            isFollowed : {type : GraphQLBoolean }
         },
    resolve(parent, args) {
        const objectType = [];
        return FollowAuthor.find(
               {$and: [{  AuthorID: args.AuthorID },{ UserID: args.UserID }]}
        ).then((records) =>{


            if(records.length == 0) {
                let FollowAuthorConstant = new FollowAuthor({
                    UserID : args.UserID,
                    AuthorID : args.AuthorID,
                    isFollowed : args.isFollowed
                });
                // objectType.push( FollowAuthorConstant.save() );
                return FollowAuthorConstant.save();
            } else {

                  return FollowAuthor.findOneAndUpdate(
                           {$and: [{  AuthorID: args.AuthorID },{ UserID: args.UserID }]},
                           args,
                           {
                             new: true,
                             returnNewDocument: true,
                           }
                        );

            }

        });
    }
  };




  const FollowAuthorArray = { FollowUnFollowObject };
  module.exports = FollowAuthorArray;
