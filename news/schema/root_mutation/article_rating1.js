/*
  * Created By : Ankita Solace
  * Created Date : 11-12-2019
  * Purpose : Declare all article rating schema methods
*/

const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean } = require('graphql'),
      ArticleRatings = require('../../models/article_rating'),
      Articles = require('../../models/articles'),
      { ArticleRatingType } = require('../types/constant'),
      await = require('await'),
      { verifyToken } = require('../middleware/middleware');

// declare the Increase clap count methods constant
  const PlusClapCount = {
    type : ArticleRatingType,
    args : {
      UserID : { type: GraphQLInt },
      ArticleID : { type: GraphQLInt }
    },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      if(id.UserID) args.UserID = id.UserID
      return ArticleRatings.find({ ArticleID: args.ArticleID, UserID : args.UserID, Status : 1 })
              .then( async ( rating ) => {
                if( rating.length == 0 ) {
                        let ArticleClapCountConstant = new ArticleRatings({
                            Description :args.UserID+"user-aritcle"+args.ArticleID,
                            UserID : args.UserID,
                            ArticleID: args.ArticleID,
                            ClapCount : 1
                        });

                    await  Articles.updateOne(
                         {$and: [{ ID: args.ArticleID },{Status: { $ne : 0}}]},
                         { $inc: { TotalClapCount : 1 }},
                         { upsert: true,returnOriginal : true }
                   );

                   return await ArticleClapCountConstant.save();
                } else {
                  await  Articles.updateOne(
                       {$and: [{ ID: args.ArticleID },{Status: { $ne : 0}}]},
                       { $inc: { TotalClapCount : -1 }},
                       { upsert: true,returnOriginal : true }
                    );

                    return await ArticleRatings.findOneAndUpdate(
                             {$and: [{ ArticleID: args.ArticleID },{ UserID: args.UserID },{Status:1}]},
                             { $set : { Status : 0 } },
                             { new: true, returnNewDocument: true }
                          )
                }
              })
        // return ArticleRatings.find({ArticleID: args.ArticleID, UserID : args.UserID }).then( async (result) =>{
        //   await Articles.updateOne(
        //        {$and: [{ ID: args.ArticleID },{Status: { $ne : 0}}]},
        //        { $inc: { TotalClapCount : 1 }},
        //        { upsert: true,returnOriginal : true }
        //  );
        //     if(result.length == 0) {
        //       let ArticleClapCountConstant = new ArticleRatings({
        //           Description :args.UserID+"user-aritcle"+args.ArticleID,
        //           UserID : args.UserID,
        //           ArticleID: args.ArticleID,
        //           ClapCount : 1
        //       });
        //     return await ArticleClapCountConstant.save();
        //     } else {
        //       return ArticleRatings.findOneAndUpdate(
        //                {$and: [{ ArticleID: args.ArticleID },{ UserID: args.UserID },{Status:1}]},
        //                { $inc: { ClapCount : 1 }},
        //                { new: true, returnNewDocument: true }
        //             );
        //     }
        // });
    }
  };

  const ArticleRatingArray = { PlusClapCount };
  module.exports = ArticleRatingArray;
