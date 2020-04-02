/*
  * Created By : Ankita Solace
  * Created Date : 14-12-2019
  * Purpose : Declare all article schema methods
*/

const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt } = require('graphql'),
      Articles = require('../../models/article'),
      BlockAuthor = require('../../models/block_author'),
      Users = require('../../models/users'),
      ArticleBookmarks = require('../../models/bookmarks'),
      UsersPaidSubscriptions = require('../../models/users_paid_subscriptions'),
      FollowAuthor = require('../../models/follow_author'),
      { ArticleType } = require('../types/constant'),
      { ArticleStatusConst, RoleObject,PremiumContentLen ,SubscribeCdnUrl } = require('../constant'),
      await = require('await');

  const Article = {
    type: new GraphQLList(ArticleType),
    args: { ID: { type: GraphQLID } },
    resolve(parent, args){ return Articles.find({ ID:args.ID, Status: ArticleStatusConst.Active }); }
  };


  const ArticlesAll = {
    type: new GraphQLList(ArticleType),
    args: { UserID: { type: GraphQLInt } },
    resolve(parent, args){
        if( args.UserID == undefined ) return getAllArticles();
        else {
          return BlockAuthor.find({ UserID : args.UserID, Status : 0 },{ AuthorID : 1, _id:0 })
          .then((isAuthor) =>{
                if(isAuthor.length == 0 ) { return getAllArticles(); }
                else return Articles.find({ AuthorID : { $nin: isAuthor.map(ID => ID.AuthorID) },Status: 1, isPublish : true });
           });
        }
    }
  };

  const ArticleBySlug = {
    type: new GraphQLList(ArticleType),
    args: {
      Slug: { type: GraphQLString },
      UserID: { type: GraphQLInt }
    },
    async resolve(parent, args) {
           let lor =  await Articles.find({ Slug: args.Slug, isPublish : true,Status:ArticleStatusConst.Approved })
               if( lor[0].isPaidSubscription && args.UserID != lor[0].AuthorID ) lor = await calculateSubscribeContent(args,lor);
               updateViewCount( args );

          if( args.UserID != 0 ) {
            await Promise.all(lor.map(async data => {
                return Promise.all([getBookMarkCount(data,args), getFollowAuthorCount( data,args )])
                  .then(function(values) {
                      data.isBookmark = (values[0] == 1);
                      data.isFollowed = (values[1] == 1);
                  });
            }));
         } else {
           lor[0].isBookmark = false;
           lor[0].isFollowed = false;
         }
         return lor;
      }
  };


  // check is user is allow to view full content according to subscription date else hide content
  async function  calculateSubscribeContent( args,lor ) {
    if( typeof lor[0].isPaidSubscription != 'undefined' &&  lor[0].isPaidSubscription ) {
       if(typeof args.UserID != 'undefined' && args.UserID != 0 ) {
           if( await checkUserSubscription( args, lor[0].AuthorID ) <= 0 ) {
              lor[0].Description = lor[0].Description.substring(0, PremiumContentLen)+' <img src="'+SubscribeCdnUrl+'">';
              lor[0].isContentAllowed = false;
           } else  lor[0].isContentAllowed = true;

       } else {
         lor[0].isContentAllowed = false;
         lor[0].Description = lor[0].Description.substring(0, PremiumContentLen)+' <img src="'+SubscribeCdnUrl+'">';
       }
    }
    return await lor;
  }

  // check vlaues in db for user allowed for subscription or not
  async function  checkUserSubscription( args,AuthorID ) {
      return UsersPaidSubscriptions.findOne({ $and : [{AuthorID : AuthorID },{ Status : { $ne : 0 } },{ UserID : args.UserID },{ EndDate :{ $gte: new Date() }  }]}).countDocuments();
  }

  // the view count of article when article is hit by any user
  async function  updateViewCount( args ) {
      Articles.updateOne(
           {$and: [{ Slug: args.Slug }]},
           { $inc: { ViewCount : 1 }},
           { new: true }
     ).then((w) =>{ return w; });
  }

  // check where article is bookmarked for login user
  async function  getBookMarkCount( data,args ) {
    return ArticleBookmarks.find({
              ArticleID: data.ID,
              UserID: args.UserID,
              Status: 1
           }).countDocuments();
  }

 // check wheather login uesr follow articles author or not
  async function  getFollowAuthorCount( data,args ) {
    return FollowAuthor.find({
               AuthorID: data.AuthorID,
               UserID: args.UserID,
               Status: 1,
               isFollowed : true
          }).countDocuments();
  }


const MyArticleList = {
    type: new GraphQLList(ArticleType),
    args: { UserID: { type: GraphQLInt } },
    resolve(parent, args){
        return Articles.find({ AuthorID: args.UserID, Status:1 });
    }
};

 const DashboardKeywordSerach = {
    type: new GraphQLList(ArticleType),
    args: { Keywords: { type: GraphQLString } },
    resolve(parent, args){
      return Articles.find( { Title: { $regex: args.Keywords, $options: "i" }, Status : ArticleStatusConst.Approved } );
    }
 };

// get popular article list and also check block author list from table
 const PopularArticleList = {
    type: new GraphQLList(ArticleType),
    args: { UserID: { type: GraphQLInt } },
    resolve(parent, args){
        if( args.UserID == undefined ) { return getAllPopularArticles(); }
        else {
          return BlockAuthor.find({ UserID : args.UserID, Status : 0 },{ AuthorID : 1, _id:0 })
          .then((isAuthor) =>{
                if(isAuthor.length == 0 ) { return getAllPopularArticles(); }
                else {
                  return Articles.find({ AuthorID : { $nin: isAuthor.map(ID => ID.AuthorID) },Status: ArticleStatusConst.Approved, isPublish : true })
                         .sort({ViewCount:-1})
                         .limit(10);
                }
           });
        }
    }
};

// get trending article list and also check block author list from table
const TrendingArticleList = {
     type: new GraphQLList(ArticleType),
     args: { UserID: { type: GraphQLInt },
             limit: { type: GraphQLInt } ,
             offset: { type: GraphQLInt }
    },
    async resolve(parent, args){
         args.offset = (args.offset * args.limit );
         let query = { Status: 2, isPublish: true };
         if( args.UserID == undefined || args.UserID == 0 ) {
           return await getAllTrendingArticles(args.limit, args.offset,args.UserID,query);
         }
         else {
           return await BlockAuthor.find({ UserID : args.UserID, Status : 0 },{ AuthorID : 1, _id:0 })
           .then(async (isAuthor) =>{
                 if(isAuthor.length == 0 ) {
                   return await getAllTrendingArticles(args.limit, args.offset,args.UserID,query);
                 }
                 else {
                   let query = { AuthorID : { $nin: isAuthor.map(ID => ID.AuthorID) },Status: ArticleStatusConst.Approved,isPublish : true };
                   return await getAllTrendingArticles(args.limit,args.offset,args.UserID,query );
                 }
            });
         }
     }
};

async function  getAllTrendingArticles(limit, offset,ArgsUserID,query ) {
      let MainFunction = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let async = require("async");
                let sortOptions = { TotalClapCount: -1,  ViewCount: -1 }

                let Data = await Articles.find(query).sort(sortOptions)
                .skip(offset).limit(limit).lean();
                async.eachSeries(Data, async (data, callback) => {
                    try {
                        let cquery = { ArticleID: data["ID"], UserID: ArgsUserID, Status: 1 };
                        let countedArticles = await ArticleBookmarks.countDocuments(cquery).lean();
                        data.isBookmark = (countedArticles >= 1) ? true : false;
                    } catch (error) { reject(error); }
                }, async (err) => { if (err) reject(err); resolve(Data); });
            } catch (error) { console.error(error); reject(error); }
        });
     }

  return await MainFunction();
}

function  getAllPopularArticles() {  return Articles.find({ Status: ArticleStatusConst.Approved, isPublish : true  }).sort({ViewCount:-1}).limit(10);}

const GetFeaturedImage = {
    type : ArticleType,
    args : {
        ArticleID : { type: GraphQLInt },
        AuthorID : { type: GraphQLInt }
    },
    resolve(root, params) {
        return Articles.find({ ArticleID: params.ArticleID,AuthorID: params.AuthorID })
        .catch(err => new Error(err));
    }
};

const GetAdminArticleList = {
  type: new GraphQLList(ArticleType),
  args: { UserID: { type: GraphQLInt } },
  resolve(parent, args) {
      return Users.find({ RoleID : { $in: [ RoleObject.admin , RoleObject.moderator ] },ID : args.UserID,Status : 1}).then((isAdmin) => {
        if(isAdmin.length) return Articles.find({ Status:{ $ne : 0 },isPublish : 1 });
        else return [];
      });
  }
};

  function  getAllArticles() { return Articles.find({ Status: 1 , isPublish : true }); }
  // function  getAllPopularArticles() { return Articles.find({ Status: 1, isPublish : true  }).sort({ViewCount:-1}).limit(10); }



  const ArticlesArray = { Article, ArticlesAll,ArticleBySlug,DashboardKeywordSerach,PopularArticleList,TrendingArticleList, GetFeaturedImage,MyArticleList ,  GetAdminArticleList };
  module.exports = ArticlesArray;
