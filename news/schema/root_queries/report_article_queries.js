/*
  * Created By : Ankita Solace
  * Created Date : 22-10-2019
  * Purpose : Declare all report article root schema methods
*/

const ReportArticle = require('../../models/report_article'),
      { ReportArticleType } = require('../types/constant'),
      { GraphQLID,GraphQLList , GraphQLString,GraphQLInt } = require('graphql'),
      { verifyToken } = require('../middleware/middleware');

  // report article list
  const ReportArticleList = {
    type: new GraphQLList(ArticleType),
    args: { ID: { type: GraphQLID } },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      return Articles.find({ ID:args.ID }); }
  };


  module.exports = { ReportArticleList };
