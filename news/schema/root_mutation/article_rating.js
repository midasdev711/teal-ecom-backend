/*
  * Created By : Ankita Solace
  * Created Date : 17-12-2019
  * Purpose : Declare all article rating schema methods
*/

const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean } = require('graphql');
const ArticleRatings = require('../../models/article_rating');
const Articles = require('../../models/article');
const { ArticleRatingType,ArticleType } = require('../types/constant');
var await = require('await');

// declare the Increase clap count methods constant
  const PlusClapCount = {
    type : ArticleRatingType,
    args : {
      UserID : { type: GraphQLInt },
      ArticleID : { type: GraphQLInt }
    },
    async resolve(parent, args) {
      console.log("here");
        return ArticleRatings.find({ArticleID: args.ArticleID, UserID : args.UserID }).then( async (result) =>{
          console.log(result);
          await Articles.updateOne(
               { ID: args.ArticleID },
               { $inc: { TotalClapCount : 1 }},
               { upsert: true,returnOriginal : true }
         );
            if(result.length == 0) {
              let ArticleClapCountConstant = new ArticleRatings({
                  Description :args.UserID+"user-aritcle"+args.ArticleID,
                  UserID : args.UserID,
                  ArticleID: args.ArticleID,
                  ClapCount : 1
              });
            return await ArticleClapCountConstant.save();
            } else {
              return ArticleRatings.findOneAndUpdate(
                       {$and: [{ ArticleID: args.ArticleID },{ UserID: args.UserID },{Status:1}]},
                       { $inc: { ClapCount : 1 }},
                       {
                         new: true,
                         returnNewDocument: true,
                       }
                    );
            }
        });




    }
  };

// declare the up vote count methods constant
  const AticleUpVote = {
    type : ArticleRatingType,
    args : {
      UserID : { type: GraphQLInt },
      ArticleID : { type: GraphQLInt }
    },
    resolve(parent, args) {
          let ArticleUpVoteConstant = new ArticleRatings({
              Description :args.UserID+"user-aritcle"+args.ArticleID,
              UserID : args.UserID,
              UpVote :1,
              ArticleID: args.ArticleID
          });

          return ArticleUpVoteConstant.save().then((result) =>{
                Articles.updateOne(
                     {$and: [{ ID: args.ArticleID },{Status:1}]},
                     { $inc: { TotalUpVote : 1 }},
                     { upsert: true }
               ).then((stat) =>{});
            return result;
          });
          // return ArticleUpVoteConstant.save();
    }
  };

// declare the down vote count methods constant
  const AticleDownVote = {
    type : ArticleRatingType,
    args : {
      UserID : { type: GraphQLInt },
      ArticleID : { type: GraphQLInt }
    },
    resolve(parent, args) {
          let ArticleDownVoteConstant = new ArticleRatings({
              Description :args.UserID+"user-aritcle"+args.ArticleID,
              UserID : args.UserID,
              DownVote :1,
              ArticleID: args.ArticleID
          });

          return ArticleDownVoteConstant.save().then((result) =>{
                Articles.updateOne(
                     {$and: [{ ID: args.ArticleID },{Status:1}]},
                     { $inc: { TotalDownVote : 1 }},
                     { upsert: true }
               ).then((stat) =>{});
            return result;
          });
          // return ArticleDownVoteConstant.save();
    }
  };



  const ArticleRatingArray = { PlusClapCount, AticleUpVote,AticleDownVote };
  module.exports = ArticleRatingArray;
