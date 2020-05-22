/*
  * Created By : Ankita Solace
  * Created Date : 11-12-2019
  * Purpose : Declare all article queries
*/

const Articles = require('../../models/articles'),
      ArticleBookmarks = require('../../models/bookmarks'),
      BlockAuthor = require('../../models/block_author'),
      FollowAuthor = require('../../models/follow_author'),
      ArticleClickDetails = require('../../models/article_click_details'),
      Users = require('../../models/users'),
      UsersPaidSubscriptions = require('../../models/users_paid_subscriptions'),
      { ArticleType } = require('../types/articles'),
      { ArticleClickType } = require('../types/article_click_details'),
      { SubTitleMaxLen,TitleMaxLen,ArticleStatusConst, RoleObject,PremiumContentLen ,SubscribeCdnUrl } = require('../constant'),
      { GraphQLID,GraphQLList , GraphQLString,GraphQLInt }= require('graphql'),
      await = require('await'),
      async = require("async");


  // get article by slug with all bookmaked and followed data
  const ArticleBySlug = {
      type: new GraphQLList(ArticleType),
      args: { Slug: { type: GraphQLString }, UserID: { type: GraphQLInt } },
      async resolve(parent, args) {
             let lor =  await Articles.find({ Slug: args.Slug, isPublish : true,Status: { $ne:ArticleStatusConst.inActive }, ArticleScope : { $ne : 0 } })
             // console.log(lor[0].ArticleScope,"----",lor[0].AuthorID);
              if(lor.length == 0 ) return [];
                 if( lor[0].ArticleScope == 2 && args.UserID != lor[0].AuthorID ) lor = await calculateSubscribeContent( args,lor );
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
  if( typeof lor[0].ArticleScope != 'undefined' &&  lor[0].ArticleScope == 2 ) {
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
     if( typeof args.UserID != "undefined" && args.UserID != null && args.UserID != 0 ) {
        updateArticleClickDetails( args );
     }

  }

  async function  updateArticleClickDetails( args ) {
    let ClickData = {};
    Articles.findOne({ "Slug" : args.Slug }).then((data) => {
          ClickData.ArticleID = data.ID;
          ClickData.UserID = args.UserID;
          ClickData.AuthorID = data.AuthorID;
          ClickData.Slug = args.Slug;
          ClickData.ArticleTitle = data.Title;
        ArticleClickDetails.create( ClickData );
    });
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


 // users article list
 const MyArticleList = {
     type: new GraphQLList(ArticleType),
     args: { UserID: { type: GraphQLInt } },
     resolve(parent, args){
         return Articles.find({ AuthorID: args.UserID, Status: { $ne : 0 } });
     }
 };

 // serach keywords like titles
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
             offset: { type: GraphQLInt },
             ArticleIds: { type: new GraphQLList(GraphQLInt) },
             Scroll : { type : GraphQLInt }
    },
    async resolve(parent, args) {
         args.offset = (args.offset * args.limit );
         let query = { Status: 2, isPublish: true, ArticleScope : { $ne : 0 } };
         if( args.UserID == undefined || args.UserID == 0 )
           return await getAllTrendingArticles( args, args.limit, args.offset,args.UserID,query);
         else {
           return await BlockAuthor.find({ UserID : args.UserID, Status : 0 },{ AuthorID : 1, _id:0 })
           .then(async (isAuthor) =>{
                 if(isAuthor.length == 0 )
                   return await getAllTrendingArticles( args, args.limit, args.offset,args.UserID,query);
                 else {
                   let query = { AuthorID : { $nin: isAuthor.map(ID => ID.AuthorID) },Status: ArticleStatusConst.Approved,isPublish : true };
                   return await getAllTrendingArticles( args, args.limit,args.offset,args.UserID,query );
                 }
            });
         }
     }
};




// manipulate the data to get the trandending article list
    async function  getAllTrendingArticles( args, limit, offset,ArgsUserID,query ) {
      var sortOptions = { ViewCount: -1, TotalClapCount: -1   },
          Data = {};
      var IntrestData = [];
      if( ArgsUserID != 0 )
        var IntrestData = await getUserIntrestData( args,ArgsUserID,sortOptions,offset,limit,query );
            Data = await IntrestCalculation( IntrestData, limit, offset, args, sortOptions,query );
        var FinalData =  await getBookmarkFlag( Data,ArgsUserID,query );

      // title and sub title char limit
      return FinalData.map( (title) => {
        console.log(title);
          if( typeof title.Title != "undefined" && title.Title.length > TitleMaxLen )
            title.Title = title.Title.substring(0, TitleMaxLen)+"...."
          if( title.Title == null )  title.Title = ""

          if( typeof title.SubTitle != "undefined" ) {
            if( typeof title.Description != "undefined" && title.Description != null && title.Description != "" ) {
              title.SubTitle = title.Description.replace( /(<([^>]+)>)/ig, '');
              title.SubTitle = title.SubTitle.substring(0, SubTitleMaxLen)+"...."
            }
          }
          return title
      })
    }


// fetch login users intrest and match repspective in article
async function getUserIntrestData( args,ArgsUserID,sortOptions,offset,limit,query ) {
    let UserData =  await Users.findOne({ ID: ArgsUserID },{ _id:false, SubCategories : true, ParentCategories: true });
    // console.log(UserData,"UserData");
    if(UserData != null && UserData.ParentCategories.length > 0 ) {
      let filterInrestSub = UserData.SubCategories.map( parent => parent.Name )
      let filterInrestParent = UserData.ParentCategories.map( sub => sub.Name )
      if( filterInrestSub.length > 0 || filterInrestParent.length > 0 ) {

          return await Articles.find({
            $and : [{ID : {$nin : args.ArticleIds }},query,
            { $or : [
                { "Categories.Name" : {$in : filterInrestParent }},
                { "Categories.SubCategories" : {$elemMatch : { Name : { $in : filterInrestSub }}}},
              ]}] })
              .sort(sortOptions).skip(offset).limit(limit)
      }
    } else return [];
}

    async function IntrestCalculation( IntrestData, limit, offset, args, sortOptions,query ) {
        if( IntrestData.length > 0 ) {
          if(limit > IntrestData.length ) { // if usr categories data finish but have limit then fetch articles
            limit = limit - IntrestData.length;
            Data = await Articles.find({ ID : { $nin : args.ArticleIds }, query }).sort(sortOptions).skip(offset).limit(limit)
            Data = IntrestData.concat(Data)
          } else Data = IntrestData;
        } else
            Data = Articles.find( query ).sort(sortOptions).skip(offset).limit(limit)
      return Data;
    }

async function  getBookmarkFlag( Data,ArgsUserID,query ) {
  return new Promise(async (resolve, reject) => {
    try {
        async.eachSeries(Data, async (data, callback) => {
            let cquery = { ArticleID: data["ID"], UserID: ArgsUserID, Status: 1 },
                countedArticles = await ArticleBookmarks.countDocuments(cquery);
                data.isBookmark = (countedArticles >= 1) ? true : false;
        }, async (err) => { if (err) reject(err); resolve(Data); });

    } catch (error) { console.error(error); reject(error); }
  });
}

// get popular article list
function  getAllPopularArticles() {  return Articles.find({ Status: ArticleStatusConst.Approved, isPublish : true  }).sort({ViewCount:-1}).limit(10);}

// get the fetured image url
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

// get the list of article to admin
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

  // get article details by Article ID
  const ArticleByID = {
    type: new GraphQLList(ArticleType),
    args: {
      ArticleID: { type: GraphQLInt },
      UserID: { type: GraphQLInt }
    },
    async resolve(parent, args) {
         let lor =  await Articles.find({ ID: args.ArticleID, isPublish : true,Status: 1 })
                          .then((result) =>{
                              Articles.updateOne(
                                   {$and: [{ Slug: args.Slug },{Status:1}]},
                                   { $inc: { ViewCount : 1 }},{ upsert: true }
                             );
                          return result;
                      });

          if( args.UserID != 0 ) {
            await Promise.all(lor.map(async data => {
                let hre =  await ArticleBookmarks.find({
                    ArticleID: data.ID,
                    UserID: args.UserID,
                    Status: 1
                }).countDocuments();
                data.isBookmark = (hre == 1);

                let isFollowed =  await FollowAuthor.find({
                        AuthorID: data.AuthorID,
                        UserID: args.UserID,
                        Status: 1,
                        isFollowed : true
                    }).countDocuments();
                    data.isFollowed = (isFollowed == 1);
            }));
         }
         return lor;
      }
  };

  // get parsered articles list by userID for bookmark and followed
  const GetParserArticleList = {
       type: new GraphQLList(ArticleType),
       args: {
          UserID: { type: GraphQLInt },
          limit: { type: GraphQLInt },
          offset: { type: GraphQLInt },
          ArticleIds: { type: new GraphQLList(GraphQLInt) },
      },
      async resolve(parent, args) {
           args.offset = (args.offset * args.limit );
           let query = { Status: 2, isPublish: true, ArticleScope : { $ne : 0 } };
           if( args.UserID == undefined || args.UserID == 0 )
             return await getAllTrendingArticles( args, args.limit, args.offset,0,query);
           else {
             return await BlockAuthor.find({ UserID : args.UserID, Status : 0 },{ AuthorID : 1, _id:0 })
             .then(async (isAuthor) =>{
                   if(isAuthor.length == 0 )
                      return await getAllTrendingArticles( args, args.limit, args.offset,args.UserID,query);
                   else {
                     let query = { AuthorID : { $nin: isAuthor.map(ID => ID.AuthorID) },Status: ArticleStatusConst.Approved,isPublish : true, ArticleScope : { $ne : 0 } };
                     return await getAllTrendingArticles( args, args.limit,args.offset,args.UserID,query );
                   }
              });
           }
       }
  };


  //get the articles
  const Article = {
    type: new GraphQLList(ArticleType),
    args: { ID: { type: GraphQLInt } },
    resolve(parent, args){ return Articles.find({ ID:args.ID, Status: { $ne : ArticleStatusConst.inActive} }); }
  };

// get all articles
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

  function  getAllArticles() { return Articles.find({ Status: 1 , isPublish : true }); }

  module.exports = { TrendingArticleList,GetFeaturedImage,MyArticleList,GetAdminArticleList, PopularArticleList,DashboardKeywordSerach,GetParserArticleList,ArticleBySlug,ArticleByID,Article,ArticlesAll };
