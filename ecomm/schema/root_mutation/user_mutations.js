
const  UserSchema  = require('../../../news/models/users');
const  Merchants = require('../../models/merchants');
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
const { verifyToken } = require('../middleware/middleware');

/* setting up the email */

const transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
       user: EmailCredentials.USER_NAME,
       pass: EmailCredentials.PASSWORD,
    }
});


/**
    * User Signup
    * @param {$Name} username
    * @param {$Email}  email
    * @param {$Password} passowrd
    * @param {$isVerified} reviewDetails
    * @param {$SignUpMethod} reviewDetails
    * @returns {$userDetails Array}
    */

const UserSignUp = {
   type : UserType,
   args: {
     Name: { type: GraphQLString },
     Email : {type : GraphQLEmail },
     Password: { type: GraphQLString },
     isVerified : { type: GraphQLBoolean },
     SignUpMethod : { type: GraphQLString },
    },
   resolve: async (parent, args ) => {
      const user = await UserSchema.find({ Email: args.Email });
        if(user.length > 0)
        {
           throw new Error('Email not available');
        }
        else
        {
          const merchant = await Merchants.find({ Email: args.Email });
            if(merchant.length > 0)
             {
               throw new Error('No user with that email');
             }
             else
             {
               let SignUpConstant = new UserSchema({
                       Name: args.Name,
                       Email : args.Email,
                       Description: args.Name+"--"+args.Email,
                       Password: Bcrypt.hashSync(args.Password,saltRounds),
                       isVerified : args.isVerified,
                       SignUpMethod : args.SignUpMethod,
                       RoleID : "3"
               });

               await SignUpConstant.save();

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
                       template: 'welcome-email',
                       message: {
                         to: args.Email
                       },
                       locals: {
                         username  : args.Name,
                       }
                   });
             }
        }
   }
 };


 /**
     * updating user details
     * @param {$Name} name
     * @param {$Email}  email
     * @param {$_id} _id
     * @returns {$userDetails Array}
     */

const UpdateUserDetail = {
   type : UserType,
  args : {
       _id : {type: GraphQLString },
       Name: { type: GraphQLString },
       Email : {type : GraphQLEmail }
   },
resolve: async (parent, args, context) => {
const id = await verifyToken(context);
const user_updates  = await  UserSchema.findOneAndUpdate(
     { _id: args._id },
      { $set: {
              Name : args.Name,
              Email :args.Email,
             }
     },
     {new: true}
 );

    return user_updates ;
  }
};

const UserArray = { UserSignUp , UpdateUserDetail};
module.exports = UserArray;
