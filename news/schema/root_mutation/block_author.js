/*
  * Created By : Ankita Solace
  * Created Date : 22-10-2019
  * Purpose : Declare all report article root schema methods
*/

const BlockAuthor = require('../../models/block_author');
const { BlockAuthorType } = require('../types/constant');
const { GraphQLList , GraphQLInt,GraphQLNonNull } = require('graphql');

  const BlockAuthors = {
    type: BlockAuthorType,
    args: {
          UserID: { type: new GraphQLNonNull(GraphQLInt) },
          AuthorID: { type: new GraphQLNonNull(GraphQLInt) }
          },
    resolve(parent, args) {
      return BlockAuthor.findOne({AuthorID : args.AuthorID, UserID : args.UserID }).then((isFound) =>{
          if(isFound == null ) {
            let BlockAuthorConstant = new BlockAuthor({
                  UserID: args.UserID,
                  AuthorID: args.AuthorID,
                  isAuthorBlocked : true
            });
            return BlockAuthorConstant.save();
          } else { return isFound; }
      });
    }
  };

  const BlockAuthorArray = { BlockAuthors };
  module.exports = BlockAuthorArray;
