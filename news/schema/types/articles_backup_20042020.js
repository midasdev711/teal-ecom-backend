/*
  * Created By : Ankita Solace
  * Created Date : 29-11-2019
  * Purpose : Declare all the constants
*/

const Users = require('../../models/users'),
      ArticleViewCounts = require('../../models/article_click_details'),
      Articles = require('../../models/articles'),
      { GraphQLObjectType, GraphQLScalarType,GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql'),
      { GraphQLEmail } = require('graphql-custom-types'),
      {  GraphQLDate } = require('graphql-iso-date'),
      { await } = require("await"),
      { GraphQLJSON } = require('graphql-type-json');


// account settings type defination for account fields in user settings
    const DefSubCategory = new GraphQLObjectType({
          name : "SubArticleCategories",
          fields : () => ({
            ID: { type: GraphQLInt },
            Name : { type:GraphQLString }
          })
    });

const DefCategoryType = new GraphQLObjectType({
      name : "ParentArticleCategories",
      fields : () => ({
        ID: { type: GraphQLInt },
        Name : { type:GraphQLString },
        SubCategories: { type : new GraphQLList(DefSubCategory) }
      })
});

// convert Decimal128 for db aritcle minimum amount
  const MinimumDonationAmountType = new GraphQLScalarType({
        name : "MinimumDonationAmountType",
        resolve(parent){
            return parseFloat(parent.MinimumDonationAmount);
        }
  });

const ArticleType = new GraphQLObjectType({
    name: 'Articles',
    fields: () => ({
        ID: { type: GraphQLInt },
        Title: { type: new GraphQLNonNull(GraphQLString) },
        SubTitle: { type: GraphQLString },
        TitleSlug: { type: GraphQLString },
        Description: { type: GraphQLString },
        Slug: { type: new GraphQLNonNull(GraphQLString) },
        Sequence: { type: GraphQLID },
        CreatedDate :{
          type:GraphQLDate,
          resolve(parent){
            return new Date(parent.CreatedDate)
          }
         },
        AuthorID :{ type: GraphQLInt },
        Authors :{
          type: new GraphQLList(GraphQLJSON),
          resolve(parent, args){
              return Users.find({ ID: parent.AuthorID });
          }
        },
        isPublish : { type : GraphQLBoolean},
        AmpSlug:{ type: GraphQLString },
        FeatureImage:{ type: GraphQLString },
        Thumbnail:{ type: GraphQLString },
        ReadMinutes:{ type: GraphQLString },
        ViewCount:{ type: GraphQLInt },
        Tags:{ type:new GraphQLList(GraphQLString) },
        Status: { type: GraphQLID },
        TotalClapCount : { type: GraphQLInt },
        Categories : {type :DefCategoryType },
        TotalArticleCount : {
          type: GraphQLInt,
          resolve(parent, args){
              return Articles.find( { Status :  1 } ).countDocuments();
          }
        },
        AcceptDonation : { type : GraphQLBoolean},
        MinimumDonationAmount : { type : MinimumDonationAmountType },
        isBookmark : { type : GraphQLBoolean},
        isFollowed : { type : GraphQLBoolean},
        isClicked : { type : GraphQLBoolean},
        // isPaidSubscription : { type : GraphQLBoolean },
        isContentAllowed : { type : GraphQLBoolean },
        ArticleScope : { type: GraphQLInt,
        description : "[{0:private},{1:public},{2:Premium}]" },
        ViewCount : {
          type : GraphQLInt,
          async resolve( parent ) {
              return await ArticleViewCounts.find({ ArticleID : parent.ID }).countDocuments()
          }
        },
    }),
});

// export all the constants
module.exports =  { ArticleType };
