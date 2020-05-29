/*
  * Created By : Ankita Solace
  * Created Date : 14-12-2019
  * Purpose : Declare all article schema methods
*/

const { GraphQLID,GraphQLBoolean , GraphQLString,GraphQLInt,GraphQLList, GraphQLInputObjectType,GraphQLFloat } = require('graphql'),
      Articles = require('../../models/articles'),
      Notifications = require('../../models/notifications'),
      { ArticleType } = require('../types/articles'),
      UploadBase64OnS3 = require('../../../upload/base64_upload'),
      { AWSCredentails } = require('../../../upload/aws_constants'),
      fs = require('fs'),
      {  ArticleStatusConst } = require('../constant'),
      uniqid = require('uniqid'),
      await = require('await'),
      each = require('foreach'),
      { verifyToken } = require('../middleware/middleware');

// approved article by admin
  const ApprovedArticle = {
      type : ArticleType,
      args : {
        AdminUserID : {type : GraphQLInt },
        ArticleID : {type : GraphQLInt }
      },
      resolve: async (parent, args, context) => {
        const id = await verifyToken(context);
        if(id.UserID) args.AdminUserID = id.UserID
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
      resolve: async (parent, args, context) => {
        const id = await verifyToken(context);
        if(id.UserID) args.AdminUserID = id.UserID

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


  // sub categories input params
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
        Categories: {type : CategoryInputType },
        AcceptDonation : { type : GraphQLBoolean },
        MinimumDonationAmount : { type : GraphQLFloat },
        isPaidSubscription : {type : GraphQLBoolean },
        ArticleScope : { type : GraphQLInt , description : "0 : 'Private', 1 : 'Public', 2 : 'Premium'"}
    },
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
       if(id.UserID) args.AuthorID = id.UserID
        if(typeof args.Title != "undefined") {
            args.TitleSlug =  args.AmpSlug = args.Title.replace(/<p>/g,"").replace(/<\/p>/g,"").trim().replace(/[^a-zA-Z0-9-. ]/g, '').replace(/\s+/g, '-').toLowerCase();
        }

        if( typeof args.FeatureImage != "undefined" )
            args.FeatureImage = await uploadFeaturedImage( args.FeatureImage, args.Slug );
        if(typeof args.Description != "undefined")
            args.Description = await uploadDescriptionImagesOnS3( args.Description );

          if( args.ID != 0  && args.ID != undefined ) {
            return  Articles.findOneAndUpdate(
                     {$and: [{  ID: args.ID }]},
                     args,
                     { new: true, upsert : true, returnNewDocument: true }
                  );
          } else {
            args.Slug = uniqid( Date.now() );
              let ArticleConstant = new Articles({
                  Title: args.Title,
                  SubTitle: args.SubTitle,
                  TitleSlug: args.TitleSlug,
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

             return await ArticleConstant.save();
           }
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
      var base = /base64/g;
           for (var i = 0; i < Urllen; i++) {
             if(base.exec(DescImageObject[i]) != null) {
                desc = await UploadBase64OnS3( DescImageObject[i] , AWSCredentails.AWS_STORIES_IMG_PATH  );
                Description = Description.replace(DescImageObject[i],desc);
             }
           }
           return Description;
  }

 // get image base64 image object from description field
 async function getBlobImageObject( DescriptionString ) {
        var m,
            urls = [],
            base = /base64/g,
            rex = /img.*?src='(.*?)'/g,
            rexd = /img.*?src='(.*?)'/g;
        if(base.exec(DescriptionString) != null) {
            if (DescriptionString.indexOf('"') >= 0 ) {
               while ( m = rexd.exec( DescriptionString ) ) {  urls.push( m[1] ); }
            } else {
              while ( m = rex.exec( DescriptionString ) ) { urls.push( m[1] ); }
             }
        }
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
    resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
    if(id.UserID) args.AuthorID = id.UserID
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
      resolve: async (parent, params, context) => {
        const id = await verifyToken(context);
        if(id.UserID) params.AuthorID = id.UserID
          params.FeatureImage = await uploadFeaturedImage( params.FeatureImage, uniqid() );
          return Articles.findOneAndUpdate(
            {$and: [{  ID : params.ArticleID },{ AuthorID: params.AuthorID },{ Status:{ $ne : ArticleStatusConst.inActive }  }]},
            { $set: { FeatureImage: params.FeatureImage } },
            { upsert: true,returnNewDocument: true }
          ).then((t) =>{ console.log(t); return t;})
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
      resolve: async (parent, params, context) => {
        const id = await verifyToken(context);
        if(id.UserID) params.AuthorID = id.UserID
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
      resolve: async (parent, params, context) => {
        const id = await verifyToken(context);
          return await Articles.findOneAndUpdate(
              { ID: params.ID, Status: {$ne : 0 } },
              { $set: { Status: ArticleStatusConst.inActive } },
              {  new: true,returnNewDocument: true }
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
      resolve: async (parent, params, context) => {
        const id = await verifyToken(context);
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
              { ID: params.ID }, params, { new: true }
          )
          .catch(err => new Error(err));
        }
  };

  const ArticlesArray = { AddArticle, DeleteArticle,UpdateArticle ,SavedFeaturedImage, PublishedArticle, UpdateTags,ApprovedArticle, RejectdArticle };
  module.exports = ArticlesArray;
