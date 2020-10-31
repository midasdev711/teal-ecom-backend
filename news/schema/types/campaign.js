/*
  * Created By : Ankita Solace
  * Created Date : 29-11-2019
  * Purpose : Declare all the constants
*/

const Campaign = require('../../models/campaign'),
      { GraphQLObjectType, GraphQLScalarType,GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql')


const CampaignType = new GraphQLObjectType({
    name: 'Campaign',
    fields: () => ({
        ID: { type: GraphQLInt },
        CampaignName: { type: new GraphQLNonNull(GraphQLString) },
        ArticleId1: { type: new GraphQLNonNull(GraphQLInt) },
        ArticleId2: { type: new GraphQLNonNull(GraphQLInt) },      
    }),
});

// export all the constants
module.exports =  { CampaignType };
