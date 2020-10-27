const { verifyToken } = require("../controllers/authController");
const { ArticleStatusConst } = require("../constant");
const Campaign = require("../models/campaign");
const get = require("lodash/get");

module.exports = {
  index: async (root, args, context) => {
    // if (context.userAuthenticate) {
    //   if (context.apiKey) {
    //     let arr = context.apiKey.split("_");
    //     args.UserID = arr[1];
    //   } else {
    //     args.UserID = null;
    //   }
    // }
    const findQuery = await buildFindQuery({
      args: args.filters,
    });
    // let data = await Campaign.find({}).populate({path: "ArticleId1", model: "articles"});
    let data=await Campaign.aggregate(
      [
      { $match: findQuery},
      { $lookup: {from: 'articles', localField: 'ArticleId1', foreignField: 'ID', as: 'ArticleId1'} },
      { $lookup: {from: 'articles', localField: 'ArticleId2', foreignField: 'ID', as: 'ArticleId2'} },
      { $lookup: {from: 'users', localField: 'authorID', foreignField: 'ID', as: 'author'} }
    ]
    );

    data.map(value=>{
      value.ArticleId1=value.ArticleId1[0];
      value.ArticleId2=value.ArticleId2[0];  

    })
    
    return data;
  },
  upsert: async (root, args, context) => {
    let attributes = get(args, "campaign");
    let campaign = await Campaign.findOne({ ID: attributes.ID });
    let IdArray = attributes.IdArray;
    if(attributes.isDeleted && IdArray.length>0){
      return Campaign.updateMany({ ID: {$in: IdArray} }, {isDeleted: true});
    }
    if (campaign) {
      return Campaign.findOneAndUpdate({ ID: attributes.ID }, attributes);
    } else {
      return Campaign.create(attributes);
    }
  },
};

const buildFindQuery = async ({ args, UserID }) => {
  let query = {isDeleted: false};

  if (get(args, "campaignIds")) {
    query.campaignIds= get(args, "campaignIds");
  }
  if (get(args, "CampaignName")) {
    query.CampaignName= get(args, "CampaignName");
  }
  if (get(args, "SplitId")) {
    query.SplitId= get(args, "SplitId");
  }
  if (get(args, "userId")) {
    query.authorID= get(args, "userId");
  }
  return query;
};
