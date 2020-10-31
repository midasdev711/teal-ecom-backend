
const  UserSchema  = require('../../../news/models/users');
const Merchants = require('../../models/merchants');
const { MerchantType } = require('../types/merchant_constant');
const { UserType } = require('../types/user_constant');
const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean ,GraphQLError} = require('graphql');
const { GraphQLEmail } = require('graphql-custom-types');
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
const randtoken = require('rand-token');
const axios = require('axios');
const Bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
const nodemailer = require('nodemailer');
const emailTemplates = require('email-templates');
const {BASE_URL ,EmailCredentials ,STRIPE_KEY , NMI_KEY , NMI_MERCHAT_URL } = require("../../constant");
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
    * single merchant/user signin
    * @param {$Email} Name
    * @param {$Password}  Description
    * @returns {$merchant or user Details Array}
    */

 const UserSignIn = {
    type:new GraphQLList(UserType),
    args: {
        Email: { type: GraphQLEmail } ,
        Password :{type : GraphQLString }
     },
    resolve: async (parent, args ) => {
       const user = await UserSchema.find({ Email: args.Email });
         if(user.length > 0)
         {
              if(user[0].isVerified)
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
                throw new Error("Account not Verified");
              }
         }
         else{
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
                        return user;
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
    }
  };



  /**
      * Merchant/User Password Reset
      * @param {$_id} id
      * @param {$token} token
      * @param {$Password} password
      * @returns {$send password reset link}
  */

  const MerchantPasswordReset = {
    type:new GraphQLList(MerchantType),
    args: {
          _id: { type: GraphQLString },
          token: {type:GraphQLString },
          Password :{type : GraphQLString }
     },
     resolve: async (parent, args) => {
        const user = await Merchants.find({ _id: args._id});
          if(user.length > 0)
          {
            if(user[0].VerificationToken  == args.token)
             {
               const user_updates  = await Merchants.findOneAndUpdate(
                   { _id: user[0]._id },
                   { $set : { VerificationToken: '' ,Password:Bcrypt.hashSync(args.Password,saltRounds)} },
                   { new : true}
                );
                const response_array = [];
                response_array.push(user_updates);
              return response_array;
             }
             else {
                 throw new Error('link not valid');
             }

          }else{
                const user = await UserSchema.find({ _id: args._id});
                if(user.length > 0)
                {
                    const user_updates  = await UserSchema.findOneAndUpdate(
                        { _id: user[0]._id },
                        { $set : { VerificationToken: '' ,Password:Bcrypt.hashSync(args.Password,saltRounds)} },
                        { new : true}
                      );
                      const response_array = [];
                      response_array.push(user_updates);
                    return response_array;

                }else{
                    throw new Error('No user with that email!');
                }
          }
     }
  };



  /**
      * Merchant/User Forgot Password / GetVerification Link
      * @param {$Email} Name
      * @returns {$send password reset link}
      */

    const MerchantForgotPassword = {
        type:new GraphQLList(MerchantType),
        args: {
            Email: { type: GraphQLEmail }
         },
         resolve: async (parent, args) => {
            const user = await Merchants.find({ Email: args.Email });
              if(user.length > 0)
              {
                if(user[0].isEmailVerified){

                  const token = randtoken.generate(32);
                  const verificationLink = BASE_URL +'reset-password/'+user[0]._id+'/'+ token;

                  const userUpdate = await Merchants.updateOne({_id: user[0]._id},{VerificationToken:token},{ new: true });

                  const email = new emailTemplates({
                        message: {
                          from: 'support@juicypie.com', // sender address
                          to: args.Email, // list of receivers
                          subject: 'Reset Password Link'
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
                          template: 'reset-password',
                          message: {
                            to: args.Email
                          },
                          locals: {
                            username        : args.Email,
                            verificationLink: verificationLink
                          }
                      });
                }else{
                   throw new Error('Account not verified yet!');
                }
              }else{
                    const user = await UserSchema.find({ Email: args.Email });
                    if(user.length > 0)
                    {
                      if(user[0].isVerified){

                        const token = randtoken.generate(32);
                        const verificationLink = BASE_URL +'reset-password/'+user[0]._id+'/'+ token;

                        const userUpdate = await UserSchema.updateOne({_id: user[0]._id},{VerificationToken:token},{ new: true });

                        const email = new emailTemplates({
                              message: {
                                from: 'support@juicypie.com', // sender address
                                to: args.Email, // list of receivers
                                subject: 'Reset Password Link'
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
                                template: 'reset-password',
                                message: {
                                  to: args.Email
                                },
                                locals: {
                                  username        : args.Email,
                                  verificationLink: verificationLink
                                }
                            });
                      }else{
                        throw new Error('Account not verified yet!');
                      }
                    }else{
                        throw new Error('No user with that email!');
                    }
              }
         }
      };

const MerchantUserArray = { UserSignIn , MerchantForgotPassword , MerchantPasswordReset };
module.exports = MerchantUserArray;
