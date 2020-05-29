/*
  * Created By : Ankita Solace
  * Created Date : 16-12-2019
  * Purpose : Declare all users queries
*/

const { GraphQLInt,GraphQLID,GraphQLList ,GraphQLFloat, GraphQLString,GraphQLBoolean,GraphQLInputObjectType } = require('graphql'),
      {  GraphQLEmail } = require('graphql-custom-types'),
      {  GraphQLDate } = require('graphql-iso-date'),
      Users = require('../../models/users'),
      EmailLogs = require('../../models/email_logs'),
      UserSettings = require('../../models/user_settings'),
      ForgotPasswordLogs = require('../../models/forgot_passwords_log'),
      { UserType,PasswordInfo,EmailLogType,ProfileImageInfo } = require('../types/constant'),
      {  AuthPayloadType }= require("../types/authorise"),
      uniqid = require('uniqid'),
      sendMailToUser = require('../mail/signup'),
      sentForgotPasswordMail = require('../mail/forgot_password'),
      { RoleObject,MAIL_DETAILS,AWSCredentails,TOKEN_SECRET_KEY } = require('../constant'),
      passwordHash = require('password-hash'),
      fs       = require('fs'),
      { generateToken,regenerateToken } = require("../middleware/middleware"),
      UploadBase64OnS3 = require('../../../upload/base64_upload'),
      { verifyToken } = require('../middleware/middleware');

  // only profile picture update
  const ProfilePictureUpdate = {
    type : ProfileImageInfo,
    args : {
        UserID: { type: GraphQLInt },
        ProfileImage : {type : GraphQLString },
      },
      resolve: async (parent, args, context) => {
        const id = await verifyToken(context);
        var AwsUrl = await UploadBase64OnS3( args.ProfileImage, AWSCredentails.AWS_USER_IMG_PATH );
        var Message = {};
        if( typeof args.UserID != "undefined" && args.UserID != 0 ) {
            Users.updateOne(
                  { ID: args.UserID },{ $set: { Avatar : AwsUrl } },{ upsert: false }
            ).then((result)=>{});
        }
        Message["Avatar"] = AwsUrl;
        return Message;
    }
  };


  // sub category Input object for sign up
  const SubcategoriesInputType = new GraphQLInputObjectType({
      name : "SubcategoriesInput",
      fields: () => ({
        ID: { type: GraphQLInt },
        Name: { type: GraphQLString },
        ParentCategoryID: { type: GraphQLInt },
      })
  });

  // parent category Input object for sign up
  const ParentCategoryInputType = new GraphQLInputObjectType({
      name : "UsersParentCategoryInput",
      fields: () => ({
        ID: { type: GraphQLInt },
        Name: { type: GraphQLString }
      })
  });

  // user sign up API
  const UserSignUp = {
    type : UserType,
    args : {
        Name: { type: GraphQLString },
        Email : {type : GraphQLEmail },
        Password: { type: GraphQLString },
        SignUpMethod : { type: GraphQLString,
         description : 'enum fileds with value allowed : ["Site","Facebook", "Google", "Mobile"]' },
        MobileNo : { type: GraphQLString },
        Dob : { type : GraphQLDate },
        Gender : { type : GraphQLString ,description : 'enum fileds with value allowed : ["Male","Female", "Other"]' },
        ParentCategories : { type : new GraphQLList(ParentCategoryInputType) },
        SubCategories : { type : new GraphQLList(SubcategoriesInputType) },
        ReferenceID  : { type : GraphQLString },
        Avatar : { type : GraphQLString },
        IpAddress : { type : GraphQLString }
    },
    async resolve(parent, args,context) {
      var UserData = [];
      args.Description = args.Name+"--"+args.Email;
      args.UniqueID = uniqid();
      args.RoleID = RoleObject.user;

      if( typeof args.Name != "undefined" )
            args.UserName = await generateUserName( args.Name );
      // SaveUserSettings( args,result.ID );

      if(typeof args.SignUpMethod  != "undefined" && args.SignUpMethod == "Site" && typeof args.Password != "undefined" ) {
        args.Password = passwordHash.generate(args.Password);
         UserData = await Users.create( args ).then((result) => {
            sendMailToUser(args.Name,args.Email,args.Name+"--"+args.Email);
            SaveUserSettings( args,result.ID ); return result;
         });
      } else if(typeof args.SignUpMethod  != "undefined" && args.SignUpMethod == "Facebook") {
          UserData = await Users.create( args ).then((result) => {
             sendMailToUser(args.Name,args.Email,args.Name+"--"+args.Email);
             SaveUserSettings( args,result.ID );return result;
          });
      } else if(typeof args.SignUpMethod  != "undefined" && args.SignUpMethod == "Google") {
          UserData = await Users.create( args ).then((result) => {
             sendMailToUser(args.Name,args.Email,args.Name+"--"+args.Email);
             SaveUserSettings( args,result.ID );return result;
          });
      }
      console.log(UserData,"UserDataUserDataUserDataUserData");
      return await generateToken(context, UserData );
      // return UserData;
    }
  };


      async function generateUserName( FullName ) {
        FullName =  await FullName.trim().replace(/ /g,"-")+"-"+await makeid(4);
        return await FullName.toLowerCase();
      }

      async function makeid(length) {
          var result           = '';
          var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
          var charactersLength = characters.length;
          for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
          // console.log(result,"result");

          return await result;
    }


    async function SaveUserSettings( args,UserID ) {
      let UserSettingsConstant = new UserSettings({
                UserID : UserID,
                Account : {
                  Name : args.Name,
                  Email : args.Email
                }
            });

          await  UserSettingsConstant.save();
    }

  // after reset link mail reset password
  const ResetPassword = {
    type : UserType,
    args : {
      UniqueLinkKey : { type : GraphQLString },
      Password : { type : GraphQLString },
    },
    resolve(parent, args)  {
      return ForgotPasswordLogs.findOneAndUpdate(
               { UniqueLinkKey : args.UniqueLinkKey },
               {$set :{ Status : 0 } },
               { upsert: false, returnNewDocument: true}
            ).then((result) => {
                var hashedPassword =   passwordHash.generate(args.Password);
                return  Users.findOneAndUpdate(
                       {$and: [{ Email : result.Email },{isVerified :1}]},
                       {$set : { Password : hashedPassword } },
                       { upsert : false, returnNewDocument: true }
                      );
            });
    }
  };

  // forgot password
  const ForgotPassword = {
    type : PasswordInfo,
    args : {
      Email : { type : GraphQLEmail }
    },
    resolve(parent, args)  {
      return  Users.findOne({Email : args.Email, isVerified :1}).then((isEmail) =>{
          var Message = {};
            if(isEmail != null && isEmail.Email) {
              sendSetPassworkLink( args );
                Message["Message"] = "We sent the link on "+args.Email+". Please check your inbox.";
            }
            else Message["Message"] = args.Email+" this email does not exists";
            return Message;
        });
    }
  };

  // call send function and set a unqiue link
  function sendSetPassworkLink( args ) {
      try {
        var end_date = new Date();
            end_date.setHours(end_date.getHours() + 48);
        var UniqueLinkKey = uniqid(args.Email+'_');

        let EmailLogConstant = new EmailLogs({
                Email : args.Email,
                Description:"Forgot Password "+args.Email,
                Subject : "Forgot Password",
                UniqueLinkKey : UniqueLinkKey,
                // From : args.ParentCategories,
                EndDate : end_date
        });
        EmailLogConstant.save();

        let ForgotPasswordLogsConstant = new ForgotPasswordLogs({
                Email : args.Email,
                Description:"Forgot Password "+args.Email,
                Subject : "Forgot Password",
                UniqueLinkKey : UniqueLinkKey,
                // From : args.ParentCategories,
                ExpiryDate : end_date
        });
        ForgotPasswordLogsConstant.save();
        sentForgotPasswordMail( ForgotPasswordLogsConstant );
        // sentForgotPasswordMail( ForgotPasswordLogsConstant );
      } catch (e) { console.log(e); }
  }

  // delete user
  const DeleteUser = {
  type : UserType,
  args : {
      ID: { type: GraphQLInt }
  },
  resolve(root, params) {
      return Users.update({ ID: params.ID },{ $set: { Status: 0 } },{ new: true })
             .catch(err => new Error(err));
    }
};
  // send mail using gmail crendentials

  // piad subscription input object
  const PaidSubscriptionInputType = new GraphQLInputObjectType({
      name: 'PaidSubscriptionInput',
      fields: () => ({
        SubscriptionID : { type : GraphQLInt },
        Name : { type : GraphQLString },
        Amount : { type : GraphQLFloat },
        Description : { type : GraphQLString },
        Days : { type : GraphQLInt }
      })
    });

  // update user data
  const UpdateUser = {
       type : UserType,
       args : {
           ID: { type: GraphQLInt },
           Name: { type: GraphQLString },
           Email : {type : GraphQLEmail },
           Description: { type: GraphQLString },
           Password: { type: GraphQLString },
           Avatar: { type: GraphQLString },
           Status: { type: GraphQLInt },
           FaceBookUrl : { type: GraphQLString },
           isPaidSubscription : { type : GraphQLBoolean },
           PaidSubscription : {type : new GraphQLList(PaidSubscriptionInputType) }
       },
       resolve: async (parent, args, context) => {
          const id = await verifyToken(context);
          if(typeof params.Avatar != "undefined")
           params.Avatar = await UploadBase64OnS3( params.Avatar , AWSCredentails.AWS_USER_IMG_PATH  );

           return await Users.findOneAndUpdate({ ID: params.ID }, params, { new: true, returnNewDocument: true  })
           .catch(err => new Error(err));
         }
   };

   const RegenerateToken = {
     type : UserType,
     args :{
       refreshToken : { type : GraphQLString }
     },
     async resolve( parent, args,context ) {
       console.log("i am");
        return await regenerateToken( context, args );
     }
   };

  module.exports = { RegenerateToken,UserSignUp,ForgotPassword,ResetPassword,ProfilePictureUpdate,DeleteUser,UpdateUser };
