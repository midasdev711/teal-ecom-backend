/*
  * Created By : Ankita Solace
  * Created Date : 09-01-2019
  * Purpose : Declare all sites schema methods
*/

const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString } = require('graphql'),
      Sites = require('../../models/sites'),
      { SiteType } = require('../types/constant'),
      { verifyToken } = require('../middleware/middleware');

  const AddSites = {
    type : SiteType,
    args : { AuthorID: { type: GraphQLInt }, SiteUrl: { type: GraphQLString } },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
        let SitesConstants = new Sites({ AuthorID: args.AuthorID, SiteUrl: args.SiteUrl });
        return SitesConstants.save();
    }
  };


  const SiteArray = { AddSites };
  module.exports = SiteArray;
