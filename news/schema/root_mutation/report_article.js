/*
  * Created By : Ankita Solace
  * Created Date : 22-10-2019
  * Purpose : Declare all report article root schema methods
*/

const ReportArticle = require('../../models/report_article'),
      BlockAuthor = require('../../models/block_author'),
      { ReportArticleType } = require('../types/constant'),
      { GraphQLID,GraphQLList , GraphQLString,GraphQLInt,GraphQLNonNull,GraphQLBoolean } = require('graphql');

  // report this article
  const ReportThisArticle = {
    type: ReportArticleType,
    args: {
          ArticleID: { type: new GraphQLNonNull(GraphQLInt) },
          UserID: { type: new GraphQLNonNull(GraphQLInt) },
          AuthorID: { type: new GraphQLNonNull(GraphQLInt) },
          ReasonType: { type: GraphQLString },
          isAuthorBlocked :{ type: GraphQLBoolean }
          },
    resolve(parent, args) {
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
               { new: true, returnNewDocument: true }
            ).then((isReported) =>{
                if( isReported == null ) return ArticleReportConstant.save() ;
                else return isReported;
            });
    }
  };



  const ReportArticleArray = { ReportThisArticle };
  module.exports = ReportArticleArray;
