/*
  * Created By : Ankita Solace
  * Created Date : 20-11-2019
  * Purpose : Declare all users schema methods
*/

const ArticleRatings = require('../../models/article_rating');
const { ArticleRatingType } = require('../types/constant');
const { GraphQLID,GraphQLInt,GraphQLList , GraphQLString, GraphQLBoolean } = require('graphql');



  const MyCheersList = {
    type: new GraphQLList(ArticleRatingType),
    args: {  UserID: { type: GraphQLInt } },
    resolve(parent, args) {
      return ArticleRatings.find({$and: [{ UserID: args.UserID },{Status:1}]});
     }
  };



const ArticleRatingArray = { MyCheersList };
module.exports = ArticleRatingArray;
