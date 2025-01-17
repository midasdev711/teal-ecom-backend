/*
  * Created By : Ankita Solace
  * Created Date : 12-12-2019
  * Purpose : Declare all report article root schema methods
*/

const ReportArticle = require('../../models/report_article');
const { ReportArticleType } = require('../types/constant');
const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt } = require('graphql');
const { verifyToken } = require('../middleware/middleware');

  const ReportArticleList = {
    type: new GraphQLList(ArticleType),
    args: { ID: { type: GraphQLID } },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      return Articles.find({ ID:args.ID }); }
  };

;

  const ReportArticleArray = { ReportArticleList };
  module.exports = ReportArticleArray;
