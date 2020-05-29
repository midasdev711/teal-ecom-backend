
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
const { generateToken,regenerateToken, regenerateCreativeToken } = require("../middleware/middleware");


/**
    * Admin Login
    * @param {$admin_email} email
    * @param {$admin_password}  password
    * @returns {adminDetails Array}
    */

const AdminCategorySignIn = {
      type:new GraphQLList(AdminType),
      args: {
          Email: { type: GraphQLEmail } ,
          Password :{type : GraphQLString }
       },
      resolve: async (parent, args ) => {
         const user = await Admin.find({ Email: args.Email });
           if(user.length > 0)
           {
             const valid = await Bcrypt.compare(args.Password, user[0].Password);
             if (!valid) {
                 throw new Error('Wrong Password');
             }
            //  return user ;
             return ( user ) ? await generateToken( context, user ) : [];
           }
           else{
               throw new Error('No admin with that email');
           }
      }
    };



const AdminArray = { AdminCategorySignIn };
module.exports = AdminArray;
