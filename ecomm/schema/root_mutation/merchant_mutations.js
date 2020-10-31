

const Merchants = require('../../models/merchants');
const  UserSchema  = require('../../../news/models/users');
const MerchantBusinessCatgory = require('../../models/merchants_business');
const MerchantContactsCatgory = require('../../models/merchats_contacts');
const { ProductType } = require('../types/product_constant');
const { MerchantType } = require('../types/merchant_constant');
const { UserType } = require('../types/user_constant');
const { GraphQLInputObjectType,GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean ,GraphQLError} = require('graphql');
const { GraphQLEmail } = require('graphql-custom-types');
const Bcrypt = require('bcrypt');
const randtoken = require('rand-token');
const nodemailer = require('nodemailer');
const emailTemplates = require('email-templates');
const path = require('path');
const saltRounds = 10;
const {BASE_URL ,EmailCredentials ,STRIPE_KEY , NMI_KEY , NMI_MERCHAT_URL } = require("../../constant");
const base64Img = require('base64-img');
const isBase64 = require('is-base64');
const fs   = require('fs');
const UploadBase64OnS3 = require('../../../upload/base64_upload'),
    { AWSCredentails } = require('../../../upload/aws_constants');
const { verifyToken } = require('../middleware/middleware');
const { generateToken,regenerateToken, regenerateCreativeToken } = require("../middleware/middleware");

/* setting up the email */
const transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
       user: EmailCredentials.USER_NAME,
       pass: EmailCredentials.PASSWORD,
    }
});


/**
    * Merchant Signup
    * @param {$Name} Name
    * @param {$Description}  Description
    * @param {$Slug} Name
    * @param {$FeatureImage}  Description
    * @param {$isParent} Name
    * @param {$ParentCategoryID}  Description
    * @returns {$merchantDetails Array}
*/

  const AddMerchantCategory = {
      type : MerchantType,
      args : {
        Name: { type: GraphQLString },
        UserName : {type: GraphQLString },
        Email : {type : GraphQLEmail },
        Password: { type: GraphQLString },
        MobileNumber:{ type: GraphQLString },
        MerchatLogo : {type: GraphQLString },
        BusinessName :{type: GraphQLString },
        BusinessWebsite :{type: GraphQLString },
        BusinessRegistrationNumber :{type: GraphQLString },
        BusinessPhone :{type: GraphQLString },
        BusinessAddress :{type: GraphQLString },
        BusinessCountry :{type: GraphQLString },
        BusinessState :{type: GraphQLString },
        BusinessCity :{type: GraphQLString },
        BusinessPostalCode :{type: GraphQLString },
        ContactPersonName :{type: GraphQLString },
        ContactPersonEmail :{type: GraphQLEmail },
        ContactPersonPhone :{type: GraphQLString },
      },
      resolve: async (parent, args ) => {
          const token = randtoken.generate(32);
          const base64Str = args.MerchatLogo;
          let imagePath = await UploadBase64OnS3(args.MerchatLogo, AWSCredentails.AWS_USER_IMG_PATH  );
          const user = await UserSchema.find({ Email: args.Email });
          if(user.length === 0)
            {
              const merchant = await Merchants.find({ Email: args.Email });
              if(merchant.length === 0)
              {
                  let SignUpMerchantConstant = new Merchants({
                          Name: args.Name,
                          Email: args.Email,
                          Password: Bcrypt.hashSync(args.Password,saltRounds),
                          MobileNumber:args.MobileNumber,
                          MerchatLogo :imagePath,
                          Status: args.Status,
                          UserName :args.UserName,
                          VerificationToken : token,
                          BusinessName :args.BusinessName,
                          BusinessWebsite : args.BusinessWebsite,
                          BusinessRegistrationNumber : args.BusinessRegistrationNumber,
                          BusinessPhone : args.BusinessPhone,
                  });
                  let user = await SignUpMerchantConstant.save();
                    let MerchantContactConstant = new MerchantContactsCatgory({
                            ContactPersonName : args.ContactPersonName,
                            ContactPersonEmail : args.ContactPersonEmail,
                            ContactPersonPhone :args.ContactPersonPhone,
                            MerchantId : user._id,
                      });
                        let merchatContact = await MerchantContactConstant.save();
                        let MerchantBusinessConstant = new MerchantBusinessCatgory({
                              BusinessAddress : args.BusinessAddress ,
                              BusinessCountry : args.BusinessCountry ,
                              BusinessState : args.BusinessState ,
                              BusinessCity : args.BusinessCity,
                              BusinessPostalCode : args.BusinessPostalCode,
                              MerchantId :user._id
                          });
                        let merchatBusinessContact = await MerchantBusinessConstant.save();
                        const verificationLink = BASE_URL +'email-verification/'+user._id+'/'+token;
                        const email = new emailTemplates({
                              message: {
                                from: 'support@juicypie.com', // sender address
                                to: args.Email, // list of receivers
                                subject: 'Welcome to Slag'
                              },
                              transport: transporter,
                              send     : true,
                              views    : {
                                root:path.resolve()+'/ecomm/email-templates',
                                options: {
                                  extension: 'ejs'
                                }
                              }
                            });
                            //generate html template for forgot password
                            email.send({
                                template: 'resend-verification',
                                message: {
                                  to: args.Email
                                },
                                locals: {
                                  username        : user.Name,
                                  verificationLink: verificationLink
                                }
                            });
                      return user;
                    }
                    else
                    {
                       throw new Error('Email already exist' );
                    }
                    }
                    else
                    {
                       throw new Error('Email already exist' );
                    }
        }
    };


    /**
        * Merchant Signin
        * @param {$Email} Name
        * @param {$Password}  Password
        * @returns {$merchantDetails Array}
        */

    const MerchantCategorySignIn = {
        type:new GraphQLList(MerchantType),
        args: {
            Email: { type: GraphQLEmail } ,
            Password :{type : GraphQLString }
         },
        resolve: async (parent, args ) => {
           const user = await Merchants.find({ Email: args.Email });
             if(user.length > 0)
             {
               if(user[0].isEmailVerified)
               {
                  if(user[0].isAdminApproved)
                   {
                     const valid = await Bcrypt.compare(args.Password, user[0].Password);
                     if (!valid) {
                         throw new Error('Wrong Password');
                     }else{
                        // return user;
                        return ( user ) ? await generateToken( context, user ) : [];
                     }
                   }
                  else
                  {
                    throw new Error("Account not approved by admin");
                  }
               }
               else
               {
                  throw new Error('please verify your account');
               }
             }
             else{
                 throw new Error('No user with that email');
             }
        }
      };


      /**
          * Merchant Verify Email
          * @param {$Email} Name
          * @returns {$send password reset link}
      */

    const MerchantEmailVerification = {
        type:new GraphQLList(MerchantType),
        args: {
            _id: { type: GraphQLString },
            token: {type:GraphQLString}
         },
         resolve: async (parent, args) => {
            const user = await Merchants.find({ _id: args._id});
              if(user.length > 0)
              {
                if(user[0].VerificationToken  == args.token)
                 {
                   const user_updates  = await Merchants.findOneAndUpdate(
                       { _id: user[0]._id},
                       { $set: { VerificationToken: '' ,isEmailVerified: "yes" ,Status :1} } ,
                       {new: true}
                    );
                    const response_array = [];
                    response_array.push(user_updates);
                  return response_array;
                 }
                 else {
                     throw new Error('link not valid');
                 }
              }else{
                  throw new Error('link not valid');
              }
         }
      };


      /**
          * Merchant Approval/DisApproval -By Admin
          * @param {$_id} merchant id
          * @param {$isAdminApproved} boolean
          * @returns {$}
      */

      const MerchantAdminApproval = {
        type : MerchantType,
        args : {
             _id : {type: GraphQLString },
            isAdminApproved :{type :GraphQLBoolean}
        },
        resolve: async (parent, args) => {
           const user_updates  = await  Merchants.findOneAndUpdate(
                { _id: args._id },
                { $set: { isAdminApproved: args.isAdminApproved , Status : 1 } },
                {new: true}
            )
            return user_updates;
          }
      };


      /**
          * Update Merchant Profile
          * @param {$_id} id
          * @param {$token} token
          * @param {$Password} password
          * @returns {$merchantDetails Array}
      */

      const UpdateMerchantCategory = {
        type : MerchantType,
        args : {
           _id : {type: GraphQLString },
           Name: { type: GraphQLString },
           UserName : {type: GraphQLString },
           Email : {type : GraphQLEmail },
           MobileNumber:{ type: GraphQLString },
           MerchatLogo : {type: GraphQLString },
           BusinessName :{type: GraphQLString },
           BusinessWebsite :{type: GraphQLString },
           BusinessRegistrationNumber :{type: GraphQLString },
           BusinessPhone :{type: GraphQLString },
           BusinessAddress :{type: GraphQLString },
           BusinessCountry :{type: GraphQLString },
           BusinessState :{type: GraphQLString },
           BusinessCity :{type: GraphQLString },
           BusinessPostalCode :{type: GraphQLString },
           ContactPersonName :{type: GraphQLString },
           ContactPersonEmail :{type: GraphQLEmail },
           ContactPersonPhone :{type: GraphQLString }
        },
        resolve: async (parent, args, context) => {
          const id = await verifyToken(context);
          const merchant_contact_updates  = await  MerchantContactsCatgory.findOneAndUpdate(
               { MerchantId: args._id },
                { $set: {
                        ContactPersonName : args.ContactPersonName,
                        ContactPersonEmail : args.ContactPersonEmail,
                        ContactPersonPhone :args.ContactPersonPhone,
                        Status : 1
                       }
               },
               {new: true}
           );

           const merchant_business_updates  = await  MerchantBusinessCatgory.findOneAndUpdate(
                { MerchantId: args._id },
                {
                  $set: {  BusinessAddress : args.BusinessAddress ,
                           BusinessCountry : args.BusinessCountry ,
                           BusinessState : args.BusinessState ,
                           BusinessCity : args.BusinessCity,
                           BusinessPostalCode : args.BusinessPostalCode,
                           Status : 1
                      }
                },
                {new: true}
            );

            let merchat_updates;

           if(isBase64(args.MerchatLogo, {allowMime: true}))
           {
              let imagePath = await UploadBase64OnS3(args.MerchatLogo, AWSCredentails.AWS_USER_IMG_PATH  );

              merchat_updates  = await  Merchants.findOneAndUpdate(
                  { _id: args._id },
                  { $set: {
                              Name: args.Name,
                              Email: args.Email,
                              MobileNumber:args.MobileNumber,
                              MerchatLogo :imagePath,
                              Status: args.Status,
                              UserName :args.UserName,
                              BusinessName :args.BusinessName,
                              BusinessWebsite : args.BusinessWebsite,
                              BusinessRegistrationNumber : args.BusinessRegistrationNumber,
                              BusinessPhone : args.BusinessPhone,
                              Status : 1
                         }
                   },
                  {new: true}
               );
           }
           else
           {
             merchat_updates  = await  Merchants.findOneAndUpdate(
                  { _id: args._id },
                  { $set: {
                              Name: args.Name,
                              Email: args.Email,
                              MobileNumber:args.MobileNumber,
                              Status: args.Status,
                              UserName :args.UserName,
                              BusinessName :args.BusinessName,
                              BusinessWebsite : args.BusinessWebsite,
                              BusinessRegistrationNumber : args.BusinessRegistrationNumber,
                              BusinessPhone : args.BusinessPhone,
                              Status : 1
                         }
                   },
                  {new: true}
               );
           }

            return merchat_updates;
          }
      };


  /**
      * Soft delete merchant
      * @param {$_id} merchantid
      * @returns {$merchantDetails Array}
  */

  const DeleteMerchantCategoryByID = {
    type : MerchantType,
    args : {
        _id: { type: GraphQLID }
    },
    resolve: async (root, params, context) => {
      const id = await verifyToken(context);
        return Merchants.updateOne(
            { ID: params.ID },
            { $set: { Status: 0 } },
            { new: true }
        )
        .catch(err => new Error(err));
      }
  };



const MerchantArray = { AddMerchantCategory, DeleteMerchantCategoryByID ,UpdateMerchantCategory ,
  MerchantCategorySignIn ,MerchantEmailVerification ,MerchantAdminApproval ,
   };
module.exports = MerchantArray;
