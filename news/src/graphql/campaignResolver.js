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
      { $match: {}},
      { $lookup: {from: 'articles', localField: 'ArticleId1', foreignField: 'ID', as: 'ArticleId1'} },
      { $lookup: {from: 'articles', localField: 'ArticleId2', foreignField: 'ID', as: 'ArticleId2'} }
    ]
    );

    data.map(value=>{
      console.log("value", value)
      console.log("ArticleId1", value.ArticleId1)
      value.ArticleId1=value.ArticleId1[0];
      value.ArticleId2=value.ArticleId2[0];  

    })
    
    return data;
  },
  upsert: async (root, args, context) => {
    let attributes = get(args, "campaign");

    let campaign = await Campaign.findOne({ ID: attributes.ID });

    if (campaign) {
      return Campaign.update(args);
    } else {
      return Campaign.create(attributes);
    }
  },
};

const buildFindQuery = async ({ args, UserID }) => {
  let query = { $and: [] };

  query.$and.push({ status: 1 });

  if (get(args, "campaignIds")) {
    query.$and.push({ ID:  get(args, "campaignIds")  });
  }
  if (get(args, "CampaignName")) {
    query.$and.push({ CampaignName:  get(args, "CampaignName")  });
  }
  

  return query;
};
