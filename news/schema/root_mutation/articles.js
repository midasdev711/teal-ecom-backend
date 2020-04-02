/*
  * Created By : Ankita Solace
  * Created Date : 14-12-2019
  * Purpose : Declare all article schema methods
*/

const { GraphQLID,GraphQLBoolean , GraphQLString,GraphQLInt,GraphQLList, GraphQLInputObjectType,GraphQLFloat } = require('graphql'),
      Articles = require('../../models/article'),
      Notifications = require('../../models/notification'),
      { ArticleType } = require('../types/constant'),
      base64Img = require('base64-img'),
      UploadBase64OnS3 = require('../../../upload/base64_upload'),
      { AWSCredentails } = require('../../../upload/aws_constants'),
      fs = require('fs'),
      {  ArticleStatusConst } = require('../constant'),
      await = require('await'),
      each = require('foreach');

// approved article by admin
  const ApprovedArticle = {
      type : ArticleType,
      args : {
        AdminUserID : {type : GraphQLInt },
        ArticleID : {type : GraphQLInt }
      },
    async   resolve(parent,args) {

      return Articles.findOneAndUpdate(
               { ID :  { $in : args.ArticleID  } },
               { $set : { Status : ArticleStatusConst.Approved } },
               { new: true, returnNewDocument: true, }
            ).then(async (addNotification) =>{

                let NotificationConstant = new Notifications({
                      SenderID :args.AdminUserID,
                      RecieverID :addNotification.AuthorID,
                      Purpose: "Approved",
                      NotifyMessage: "Admin has approved your article"+addNotification.Title,
                      Subject: addNotification.Title+" is approved",
                      CreatedBy: args.AdminUserID,
                      ModifiedBy: args.AdminUserID
                });

                NotificationConstant.save();
                return addNotification;
            });
      }
  };

// reject article by admin
  const RejectdArticle = {
      type : ArticleType,
      args : {
        AdminUserID : {type : GraphQLInt },
        ArticleID : {type : GraphQLInt }
      },
    async   resolve(parent,args) {

      return Articles.findOneAndUpdate(
               { ID :  { $in : args.ArticleID  } },
               { $set : { Status : ArticleStatusConst.Rejected } },
               { new: true, returnNewDocument: true, }
            ).then(async (addNotification) =>{

                let NotificationConstant = new Notifications({
                      SenderID :args.AdminUserID,
                      RecieverID :addNotification.AuthorID,
                      Purpose: "Rejected",
                      NotifyMessage: "Admin has rejected your article"+addNotification.Title,
                      Subject: addNotification.Title+" is rejected",
                      CreatedBy: args.AdminUserID,
                      ModifiedBy: args.AdminUserID
                });

                NotificationConstant.save();
                return addNotification;
            });
      }
  };


  const SubCategoriesInputType = new GraphQLInputObjectType({
      name: 'SubCategoriesInput',
      fields: () => ({
          ID: {   type: GraphQLInt },
          Name: {   type: GraphQLString }
      })
  });
  // input object of arguments to userSettings
  const CategoryInputType = new GraphQLInputObjectType({
      name: 'CategoriesInput',
      fields: () => ({
        ID: {   type: GraphQLInt },
        Name: {   type: GraphQLString },
        SubCategories :  {   type: new GraphQLList(SubCategoriesInputType) }
      })
  });



// add article
  const AddArticle = {
    type:  ArticleType,
    args : {
        ID: { type: GraphQLInt },
        Title: { type: GraphQLString },
        SubTitle: { type: GraphQLString },
        Description: { type: GraphQLString },
        AuthorID : {type : GraphQLInt},
        FeatureImage:{ type: GraphQLString },
        ReadMinutes :{ type: GraphQLString },
        Tags:{ type:new GraphQLList(GraphQLString) },
        isPublish : {type : GraphQLBoolean },
        Categories: {type : new GraphQLList(CategoryInputType)},
        AcceptDonation : { type : GraphQLBoolean },
        MinimumDonationAmount : { type : GraphQLFloat },
        isPaidSubscription : {type : GraphQLBoolean }
    },
   async resolve(parent, args) {
     // console.log("herhehre",args);
        if(typeof args.Title != "undefined") {
            args.Slug =  args.AmpSlug = args.Title.replace(/<p>/g,"").replace(/<\/p>/g,"").trim().replace(/[^a-zA-Z0-9-. ]/g, '').replace(/\s+/g, '-').toLowerCase();
        }

        if( typeof args.FeatureImage != "undefined" )
            args.FeatureImage = await uploadFeaturedImage( args.FeatureImage, args.Slug );
        if(typeof args.Description != "undefined")
            args.Description = await uploadDescriptionImagesOnS3( args.Description );

        let ArticleConstant = new Articles({
                Title: args.Title,
                SubTitle: args.SubTitle,
                Description: args.Description,
                Slug: args.Slug,
                AuthorID: args.AuthorID,
                AmpSlug: "amp/"+args.Slug,
                FeatureImage: args.FeatureImage,
                ReadMinutes: args.ReadMinutes,
                Tags : args.Tags,
                isPublish: args.isPublish,
                AcceptDonation : args.AcceptDonation,
                Categories : args.Categories,
                MinimumDonationAmount : args.MinimumDonationAmount,
                isPaidSubscription : args.isPaidSubscription
        });

          if( args.ID != 0  && args.ID != undefined ) {
            return  Articles.findOneAndUpdate(
                     {$and: [{  ID: args.ID }]},
                     args,
                     {
                       new: true,
                       returnNewDocument: true
                     }
                  );
          } else { return await ArticleConstant.save(); }
    }
  };

  // upload featured image on s3 and return aws url
  async function  uploadFeaturedImage( ImageBase64,Slug ) {
    return await UploadBase64OnS3( ImageBase64 , AWSCredentails.AWS_USER_IMG_PATH,Slug  );
  }

 // upload image inside description string on aws, replace the aws return url in description
  async function  uploadDescriptionImagesOnS3( Description ) {
      var DescImageObject = await getBlobImageObject( Description ),
          Urllen = DescImageObject.length;

           for (var i = 0; i < Urllen; i++) {
              desc = await UploadBase64OnS3( DescImageObject[i] , AWSCredentails.AWS_STORIES_IMG_PATH  );
              Description = Description.replace(DescImageObject[i],desc);
           }

           return Description;
  }

 // get image base64 image object from description field
 async function getBlobImageObject( DescriptionString ) {
        var m,
            urls = [],
            rex = /img.*?src='(.*?)'/g,
            rexd = /img.*?src='(.*?)'/g;
            // console.log("fourth");
         if (DescriptionString.indexOf('"') >= 0 ) { while ( m = rexd.exec( DescriptionString ) ) { urls.push( m[1] ); } } else { while ( m = rex.exec( DescriptionString ) ) { urls.push( m[1] ); } }
         return await urls;
      }



  // update only tags
  const UpdateTags = {
    type : ArticleType,
    args : {
        ArticleID : {type : GraphQLInt},
        AuthorID : {type : GraphQLInt},
        Tags:{ type:new GraphQLList(GraphQLString) }
    },
    resolve(root, args) {
        return Articles.updateOne(
            {$and: [{  ID: args.ArticleID },{ AuthorID: args.AuthorID },{ Status: ArticleStatusConst.Active }]},
            { $set: { Tags: args.Tags } },
            { upsert: true }
        ).then((res) => {console.log(res);});
    }
  };


  // saved featured image only
  const SavedFeaturedImage = {
      type : ArticleType,
      args : {
        ArticleID : { type: GraphQLInt },
        AuthorID : { type: GraphQLInt },
        FeatureImage : { type: GraphQLString }
      },
      resolve(root, params) {
          return Articles.updateOne(
            {$and: [{  ArticleID: params.ArticleID },{ AuthorID: params.AuthorID },{ Status: ArticleStatusConst.Active }]},
            { $set: { FeatureImage: params.FeatureImage } },
            { upsert: true }
          )
          .catch(err => new Error(err));
        }
    };

  // save publish aritcle
  const PublishedArticle = {
      type : ArticleType,
      args : {
        ArticleID : { type: GraphQLInt },
        AuthorID : { type: GraphQLInt }
      },
      resolve(root, params) {
          return Articles.updateOne(
            {$and: [{  ArticleID: params.ArticleID },{ AuthorID: params.AuthorID },{ Status: ArticleStatusConst.Active }]},
            { $set: { isPublish: params.isPublish } },
            { upsert: true }
          )
          .catch(err => new Error(err));
        }
    };

  // delete article
  const DeleteArticle = {
      type: ArticleType,
      args : {
          ID: { type: GraphQLInt }
      },
      async resolve(root, params) {
          return await Articles.findOneAndUpdate(
              { ID: params.ID, Status: 1 },
              { $set: { Status: ArticleStatusConst.inActive } },
              {
                new: true,
                returnNewDocument: true
              }
          )
          .catch(err => new Error(err));
        }
  };

  // update article
  const UpdateArticle =   {
      type : ArticleType,
      args : {
          ID: { type: GraphQLInt },
          Title: { type: GraphQLString },
          SubTitle: { type: GraphQLString },
          Description: { type: GraphQLString },
          Slug: { type: GraphQLString },
          Sequence: { type: GraphQLInt },
          Author :{ type: GraphQLString },
          AmpSlug:{ type: GraphQLString },
          FeatureImage:{ type: GraphQLString },
          ReadMinutes :{ type: GraphQLString },
          Status: { type: GraphQLInt },
          isPublish : {type : GraphQLBoolean}
      },
      resolve(root, params) {
        if(params.Title == "") delete params.Title;
        if(params.SubTitle == "") delete params.SubTitle;
        if(params.Description == "") delete params.Description;
        if(params.Slug == "") delete params.Slug;
        if(params.Sequence == "") delete params.Sequence;
        if(params.Status == "") delete params.Status;
        if(params.Author == "") delete params.Author;
        if(params.AmpSlug == "") delete params.AmpSlug;
        if(params.FeatureImage == "") delete params.FeatureImage;
        if(params.isPublish == "") delete params.isPublish;
        if(params.ReadMinutes == "") delete params.ReadMinutes;

          return Articles.updateOne(
              { ID: params.ID },
              params,
              { new: true }
          )
          .catch(err => new Error(err));
        }
  };

  const ArticlesArray = { AddArticle, DeleteArticle,UpdateArticle ,SavedFeaturedImage, PublishedArticle, UpdateTags,ApprovedArticle, RejectdArticle };
  module.exports = ArticlesArray;
