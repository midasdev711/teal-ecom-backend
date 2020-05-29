const Admin = require('../../models/admin');
const { AdminType } = require('../types/admin_constant');
const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean ,GraphQLError} = require('graphql');
const { GraphQLEmail } = require('graphql-custom-types');
const Categories = require('../../../news/models/categories');
const { CategoryType } = require('../../../news/schema/types/constant');
const Bcrypt = require('bcrypt');
const base64Img = require('base64-img');
const isBase64 = require('is-base64');
const fs   = require('fs');
const UploadBase64OnS3 = require('../../../upload/base64_upload'),
    { AWSCredentails } = require('../../../upload/aws_constants');
const { verifyToken } = require('../middleware/middleware');

  /**
      * Add product category/subcategory
      * @param {$Name} Name
      * @param {$Description}  Description
      * @param {$Slug} Name
      * @param {$FeatureImage}  Description
      * @param {$isParent} Name
      * @param {$ParentCategoryID}  Description
      * @returns {$adminDetails Array}
      */

    const AddProductCategorySubcategory = {
      type : CategoryType,
      args : {
          Name: { type: GraphQLString },
          Description: { type: GraphQLString },
          Slug: { type: GraphQLString },
          FeatureImage : { type: GraphQLString },
          isParent : { type: GraphQLBoolean },
          ParentCategoryID : { type: GraphQLInt }
      },
      resolve: async (parent, args, context) => {
         const id = await verifyToken(context);
         let base64Str = args.FeatureImage;
         let imagePath = await UploadBase64OnS3(args.FeatureImage, AWSCredentails.AWS_PRODUCT_THUMBNAIL  );

        let CategoryConstant = new Categories({
                  Name: args.Name,
                  Description: args.Description,
                  Slug: args.Slug,
                  FeatureImage: imagePath,
                  isParent: args.isParent,
                  ParentCategoryID: args.ParentCategoryID
          });
          return CategoryConstant.save();
      }
    };



     /**
        * Update product category/subcategory
        * @param {$ID} ID
        * @param {$Description} Description
        * @param {$Slug} $Slug
        * @param {$FeatureImage}  $FeatureImage
        * @param {$Status}  Status
        * @returns {$categoryDetails Array}
        */

    const UpdateProductCategorySubcategory = {
      type : CategoryType,
      args : {
          ID: { type: GraphQLInt },
          Name: { type: GraphQLString },
          Description: { type: GraphQLString },
          Slug: { type: GraphQLString },
          Status: { type: GraphQLID },
          FeatureImage : { type: GraphQLString }
      },
      resolve: async (parent, args, context) => {
        const id = await verifyToken(context);
            if(isBase64(args.MerchatLogo, {allowMime: true}))
            {
               let imagePath = await UploadBase64OnS3(args.FeatureImage, AWSCredentails.AWS_PRODUCT_THUMBNAIL  );

               let category_updates  = await  Categories.findOneAndUpdate(
                   { ID: args.ID },
                   { $set: {
                             Name: args.Name,
                             Description: args.Description,
                             Slug: args.Slug,
                             FeatureImage: imagePath,
                          }
                    },
                   {new: true}
                );
            }
            else
            {
              let category_updates  = await  Categories.findOneAndUpdate(
                   { ID: args.ID },
                   { $set: {
                             Name: args.Name,
                             Description: args.Description,
                             Slug: args.Slug,
                             FeatureImage: args.FeatureImage
                          }
                    },
                   {new: true}
                );
            }
         return category_updates;
       }
    };



    /**
       * Soft remove category/subcategory
       * @param {$ID} ID
       * @param {$ParentCategoryID} ParentCategoryID
       * @returns {$categoryDetails Array}
       */

    const RemoveProductCategorySubcategory = {
      type : CategoryType,
      args : {
          ID: { type: GraphQLInt },
          ParentCategoryID : { type: GraphQLInt }
      },
      resolve: async (parent, args, context) => {
        const id = await verifyToken(context);
        let category_updates;
          if(args.ParentCategoryID === 0)
            {
              let subcat_updates  = await  Categories.updateMany(
                  { ParentCategoryID: args.ID },
                  { $set: {
                           Status : 0
                         }
                   },
                  {new: true}
               );

              category_updates  = await  Categories.findOneAndUpdate(
                  { ID: args.ID },
                  { $set: {
                           Status : 0
                         }
                   },
                  {new: true}
               );
            }
          else
           {
             category_updates  = await  Categories.findOneAndUpdate(
                 { ID: args.ID },
                 { $set: {
                          Status : 0
                        }
                  },
                 {new: true}
              );
           }
        return category_updates;
      }
    };


  const CategoryArray = { AddProductCategorySubcategory , UpdateProductCategorySubcategory , RemoveProductCategorySubcategory };
  module.exports = CategoryArray;
