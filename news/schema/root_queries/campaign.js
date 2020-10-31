/*
  * Created By : Ankita Solace
  * Created Date : 29-11-2019
  * Purpose : Declare all article category schema methods
*/


const Campaign = require('../../models/campaign'),
      { CampaignType } = require('../types/campaign'),
      { GraphQLID,GraphQLList , GraphQLInt, GraphQLString }= require('graphql'),
      { verifyToken } = require('../middleware/middleware');

// get camapign by id
  const CampaignByID = {
    type: new GraphQLList(CampaignType),
    args: { ID: { type: GraphQLID } },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      return Campaign.find({ ID:args.ID }); }
  };

// get all campaign
  const GetAllCampaign = {
    type: new GraphQLList(CampaignType),
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      return Campaign.find({}); }
  };

  // get campaign by name
  const GetCampaignByName = {
    type :  new GraphQLList( CampaignType ),
    args: {CampaignName: { type: GraphQLString }},
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      return Campaign.find({ CampaignName: args.CampaignName });
    }
  };


  module.exports = { CampaignByID, GetAllCampaign, GetCampaignByName };
