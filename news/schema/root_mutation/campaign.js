const { GraphQLID,GraphQLBoolean , GraphQLString,GraphQLInt,GraphQLList, GraphQLInputObjectType,GraphQLFloat } = require('graphql'),
      Campaign = require('../../models/campaign'),
      Notifications = require('../../models/notifications'),
      { CampaignType } = require('../types/campaign'),
      UploadBase64OnS3 = require('../../../upload/base64_upload'),
      { AWSCredentails } = require('../../../upload/aws_constants'),
      fs = require('fs'),
      {  ArticleStatusConst } = require('../constant'),
      uniqid = require('uniqid'),
      await = require('await'),
      each = require('foreach'),
      { verifyToken } = require('../middleware/middleware');





// add and update article
  const AddCampaign = {
    type:  CampaignType,
    args : {
        ID: { type: GraphQLInt },
        CampaignName: {type: GraphQLString},
        ArticleId1: {  type: GraphQLInt},
        ArticleId2: {  type: GraphQLInt}
    },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
       if(id.UserID) return null;
          if( args.ID != 0  && args.ID != undefined ) {
            return  Campaign.findOneAndUpdate(
                     {$and: [{  ID: args.ID }]},
                     args,
                     { new: true, upsert : true, returnNewDocument: true }
                  );
          } else {
              let CampaignConstant = new Campaign({
                ID: { type: GraphQLInt },
                CampaignName: {type: GraphQLString},
                ArticleId1: {  type: GraphQLInt},
                ArticleId2: {  type: GraphQLInt}
              });

             return await CampaignConstant.save();
           }
    }
  };

  //Delete Campaign
  const DeleteCampaign = {
    type : CampaignType,
    args : {
        ID: { type: GraphQLID }
    },
    resolve: async (parent, params, context) => {
       const id = await verifyToken(context);
       return Campaign.findOneAndDelete(
           { ID: params.ID },
           { $set: { Status: 0 } },
           { new: true }
       )
       .catch(err => new Error(err));
     }
  };


  const CampaignArray = { AddCampaign, DeleteCampaign };

  module.exports = CampaignArray;






