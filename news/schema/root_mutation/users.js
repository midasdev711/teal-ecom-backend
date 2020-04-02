/*
  * Created By : Ankita Solace
  * Created Date : 16-12-2019
  * Purpose : Declare all users schema methods
*/

const { UserType,UserSettingType } = require('../types/constant'),
      { GraphQLInt,GraphQLFloat,GraphQLList , GraphQLString,GraphQLBoolean,GraphQLInputObjectType } = require('graphql'),
      {  GraphQLEmail } = require('graphql-custom-types'),
      Users = require('../../models/users'),
      UserSettings = require('../../models/user_settings'),
      await = require('await'),
      fs = require('fs'),
      { client, UploadFolderPath,ServerImageFolder,UserLocalImagePath, RoleObject,ArticleStatusConst } = require('../constant');
var UploadBase64OnS3 = require('../../../upload/base64_upload'),
     sendMailToUser = require('../mail/signup'),
    { AWSCredentails } = require('../../../upload/aws_constants');
// const { LoginUserRoleID } = require('../constant'),


// var base64Img = require('base64-img');


      const AddUser = {
          type : UserType,
          args : {
              ID: { type: GraphQLInt },
              Name: { type: GraphQLString },
              Email : {type : GraphQLEmail },
              Description: { type: GraphQLString },
              Password: { type: GraphQLString }
          },
          resolve(parent, args) {
              let UserConstant = new Users({
                  ID: args.ID,
                  Name: args.Name,
                  Email : args.Email,
                  Description: args.Description,
                  Password: args.Password,
                  RoleID : LoginUserRoleID
              });
              return UserConstant.save();
          }
      };

  const DeleteUser = {
    type : UserType,
    args : {
        ID: { type: GraphQLInt }
    },
    resolve(root, params) {
        return Users.update(
            { ID: params.ID },
            { $set: { Status: 0 } },
            { new: true }
        )
        .catch(err => new Error(err));
      }
  };

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
        async resolve(root, params) {
          if(typeof params.Avatar != "undefined")
            params.Avatar = await UploadBase64OnS3( params.Avatar , AWSCredentails.AWS_USER_IMG_PATH  );

            return await Users.findOneAndUpdate(
                { ID: params.ID },
                params,
                { new: true, returnNewDocument: true  }
            )
            .catch(err => new Error(err));
          }
    };




  const UserSignUp = {
    type : UserType,
    args : {
        Name: { type: GraphQLString },
        Email : {type : GraphQLEmail },
        Password: { type: GraphQLString },
        isVerified : { type: GraphQLBoolean },
        SignUpMethod : { type: GraphQLString },
    },
    async resolve(parent, args,context) {
        let SignUpConstant = new Users({
                Name: args.Name,
                Email : args.Email,
                Description: args.Name+"--"+args.Email,
                Password: args.Password,
                isVerified : args.isVerified,
                SignUpMethod : args.SignUpMethod,
                RoleID : RoleObject.user
        });

        return Users.findOne({ Email : args.Email }).then(async (checkEmail) =>{

            if( checkEmail != null ) {
                Users.updateOne(  { Email : args.Email },{ $inc: { UserCounter : 1 }});
                checkEmail.UserCounter ++;
                return  checkEmail;
            }
            else {
              return await SignUpConstant.save()
                     .then(async (result) => {
                              sendMailToUser(args.Name,args.Email,args.Name+"--"+args.Email);
                              let UserSettingsConstant = new UserSettings({
                                  UserID : result.ID,
                                  Account : {
                                    Name : args.Name,
                                    Email : args.Email
                                  }
                              });

                              await  UserSettingsConstant.save();
                              return await result;
                      })
                     .catch((err) => {  return err; });
            }

        });

    }
  };




  const UsersArray = { AddUser, DeleteUser,UpdateUser,UserSignUp };
  module.exports = UsersArray;
