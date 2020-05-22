/*
  * Created By : Ankita Solace
  * Created Date : 09-01-2020
  * Purpose : Declare all sites queries methods
*/

const { GraphQLInt,GraphQLList , GraphQLString } = require('graphql'),
      Sites = require('../../models/sites'),
      { SiteType } = require('../types/constant');

  // get all sites parsers artilcle
  const AllSites = {
    type: new GraphQLList(SiteType),
    resolve(parent, args) { return Sites.find({ Status : 1 }); }
  };


  module.exports = { AllSites };
