/*
  * Created By : Ankita Solace
  * Created Date : 16-12-2019
  * Purpose : Declare all users schema methods
*/

const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean,GraphQLInputObjectType } = require('graphql');
const {  GraphQLEmail } = require('graphql-custom-types');
const {  GraphQLDate } = require('graphql-iso-date');
const Users = require('../../models/users');
const EmailLogs = require('../../models/email_logs');
const ForgotPasswordLogs = require('../../models/forgot_passwords_log');
const { UserType,PasswordInfo,EmailLogType,ProfileImageInfo } = require('../types/constant');
const uniqid = require('uniqid');
const { RoleObject,MAIL_DETAILS,ImagePath,client } = require('../constant');
var passwordHash = require('password-hash');
var base64Img = require('base64-img');
const fs = require('fs');


const ProfilePictureUpdate = {
  type : ProfileImageInfo,
  args : {
      UserID: { type: GraphQLInt },
      ProfileImage : {type : GraphQLString },
    },
      async resolve(parent, args) {
        var Message = {};
        args = await  uploadProfileImage( args );
        if( typeof args.UserID != "undefined" && args.UserID != 0 ) {
          Users.updateOne(
                { ID: args.UserID },
                { $set: { Avatar : args.ProfileImage } },
                { upsert: false }
          ).then((result)=>{});
        }
        Message["Avatar"] = args.ProfileImage;
        return Message;
      }
};


function  uploadProfileImage( object ) {
  var arrayP = [];
      var res = object.ProfileImage.match(/base64/g);
      if( res != null ) {
        var filepath = base64Img.imgSync(object.ProfileImage, ImagePath.PRE_LAUNCH_PROFILE_IMG , uniqid() );
        console.log(filepath);
        object.ProfileImage = ImagePath.SERVER_IMG_URL+filepath;
        arrayP.push( filepath );
        moveOnServerFeaturedImg( ImagePath.PRE_LAUNCH_PROFILE_IMG,arrayP );
      }
      return object;
}

async function  moveOnServerFeaturedImg( folderPath,filepath ) {
  client.connect( function () {
         client.upload([ folderPath+'/**'], ImagePath.SERVER_IMG_FOLDER, {
            baseDir: ImagePath.SERVER_IMG_FOLDER+folderPath,
            overwrite: ImagePath.SERVER_IMG_FOLDER,
        },  function (result) {
              for (var i = 0; i < filepath.length; i++) {
                fs.unlink(filepath[i], (err) => {});
              }
         });
    });
}

const SubcategoriesInputType = new GraphQLInputObjectType({
    name : "SubcategoriesInput",
    fields: () => ({
      ID: { type: GraphQLInt },
      Name: { type: GraphQLString },
      ParentCategoryID: { type: GraphQLInt },
    })
});

const ParentCategoryInputType = new GraphQLInputObjectType({
    name : "UsersParentCategoryInput",
    fields: () => ({
      ID: { type: GraphQLInt },
      Name: { type: GraphQLString }
    })
});

  const UserSignUp = {
    type : UserType,
    args : {
        Name: { type: GraphQLString },
        Email : {type : GraphQLEmail },
        Password: { type: GraphQLString },
        // isVerified : { type: GraphQLBoolean },
        SignUpMethod : { type: GraphQLString },
        MobileNo : { type: GraphQLString },
        Dob : { type : GraphQLDate },
        Gender : { type : GraphQLString },
        ParentCategories : { type : new GraphQLList(ParentCategoryInputType) },
        SubCategories : { type : new GraphQLList(SubcategoriesInputType) },
        ReferenceID  : { type : GraphQLString },
    },
    async resolve(parent, args,context) {
        let SignUpConstant = new Users({
                Name: args.Name,
                Email : args.Email,
                Description: args.Name+"--"+args.Email,
                Password : passwordHash.generate(args.Password),
                // i1992-05-11sVerified : args.isVerified,
                SignUpMethod : args.SignUpMethod,
                ParentCategories : args.ParentCategories,
                SubCategories : args.SubCategories,
                Gender : args.Gender,
                Dob : args.Dob,
                MobileNo : args.MobileNo,
                UniqueID  : uniqid(),
                ReferenceID : args.ReferenceID,
                RoleID : RoleObject.user
        });

        return await SignUpConstant.save();
    }
  };



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
            )
            .then((result) => {
                  var hashedPassword =   passwordHash.generate(args.Password);
                return  Users.findOneAndUpdate(
                       {$and: [{ Email : result.Email },{isVerified :1}]},
                       {$set : { Password : hashedPassword } },
                       { upsert : false, returnNewDocument: true }
                 );
            });
    }
  };

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
      // throw new Error('Unavailable in your country.');
    }
  };


  function sendSetPassworkLink( args ) {
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
    //
    // console.log(EmailLogConstant);
    sentForgotPasswordMail( ForgotPasswordLogsConstant );
  }


  function sentForgotPasswordMail( EmailObject ) {
    console.log(MAIL_DETAILS);
      var nodemailer = require('nodemailer');


      var transporter = nodemailer.createTransport({
        service: MAIL_DETAILS.service,
        auth: {
            user: MAIL_DETAILS.User,
            pass: MAIL_DETAILS.Password
        }
      });
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
      console.log(EmailObject.Description);
      var mailOptions = {
        from: MAIL_DETAILS.User,
        to: EmailObject.Email,
        subject: EmailObject.Subject,
        text:
            'Sending Email using Node.js'+
            '<h2>Reset Password</h2>'+
            '<body> Please the link below to active it will get decative after an hr'+EmailObject.Description+
            MAIL_DETAILS.HTTP_RESET_URL+'?verify='+EmailObject.UniqueLinkKey+'</body>'
      };


      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  }

  const UsersArray = { UserSignUp,ForgotPassword,ResetPassword,ProfilePictureUpdate };
  module.exports = UsersArray;
