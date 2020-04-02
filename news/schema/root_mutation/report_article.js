/*
  * Created By : Ankita Solace
  * Created Date : 22-10-2019
  * Purpose : Declare all report article root schema methods
*/

const ReportArticle = require('../../models/report_article');
const BlockAuthor = require('../../models/block_author');
const { ReportArticleType } = require('../types/constant');
const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt,GraphQLNonNull,GraphQLBoolean } = require('graphql');

  const ReportThisArticle = {
    type: ReportArticleType,
    args: {
          ArticleID: { type: new GraphQLNonNull(GraphQLInt) },
          UserID: { type: new GraphQLNonNull(GraphQLInt) },
          AuthorID: { type: new GraphQLNonNull(GraphQLInt) },
          ReasonType: { type: GraphQLString },
          isAuthorBlocked :{ type: GraphQLBoolean }
          // Status : { type: GraphQLBoolean }
          },
    resolve(parent, args){

      if(typeof args.isAuthorBlocked != "undefined" && args.isAuthorBlocked ) {
              BlockAuthor.deleteMany( {$and: [{ UserID: args.UserID },{ AuthorID: args.AuthorID }]}).then((t) =>{ console.log(t);});
              let BlockAuthorConstant = new BlockAuthor({
                    ArticleID: args.ArticleID,
                    UserID: args.UserID,
                    AuthorID: args.AuthorID,
                    isAuthorBlocked : args.isAuthorBlocked
              });
              BlockAuthorConstant.save();
      }

      let ArticleReportConstant = new ReportArticle({
            ArticleID: args.ArticleID,
            UserID: args.UserID,
            AuthorID: args.AuthorID,
            ReasonType: args.ReasonType,
            isAuthorBlocked : args.isAuthorBlocked
      });

      return ReportArticle.findOneAndUpdate(
               {$and: [{ ArticleID: args.ArticleID },{ UserID: args.UserID },{ AuthorID: args.AuthorID }]},
               args,
               {
                 new: true,
                 returnNewDocument: true,
               }
            ).then((isReported) =>{
              console.log(isReported);
                if( isReported == null ) return ArticleReportConstant.save() ;
                else return isReported;
            });

      // return BlockAuthor.find({
      //         ArticleID: args.ArticleID,UserID: args.UserID,AuthorID: args.AuthorID,Status : false
      // }).then((isBlock) => {
      //       const testdata = [];
      //       console.log(isBlock);
      //       if(isBlock.length == 0) {
      //           return ArticleReportConstant.save().then((result) =>{
      //                 if(args.isAuthorBlocked) {
      //                     let BlockAuthorConstant = new BlockAuthor({
      //                           ArticleID: args.ArticleID,
      //                           UserID: args.UserID,
      //                           AuthorID: args.AuthorID,
      //                           isAuthorBlocked : args.isAuthorBlocked
      //                     });
      //                     result =  BlockAuthorConstant.save().catch((error) => { return error; });
      //                 }
      //
      //                 testdata.push( result );
      //                 return testdata;
      //           });
      //       } else { return isBlock; }
      // });

    }
  };



  const ReportArticleArray = { ReportThisArticle };
  module.exports = ReportArticleArray;
