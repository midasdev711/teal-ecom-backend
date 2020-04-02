/*
  * Created By : Ankita Solace
  * Created Date : 14-12-2019
  * Purpose : Declare all users schema methods
*/

const Users = require('../../models/users'),
      SubscriptionList = require('../../models/subscription_list'),
      // DonationTranscations = require('../../models/donation_transaction'),
      { UserType } = require('../types/constant'),
      // { DonationTranscationType } = require('../types/donation_transaction'),
      { GraphQLID,GraphQLInt,GraphQLList , GraphQLString, GraphQLBoolean } = require('graphql'),
      {  GraphQLEmail } = require('graphql-custom-types'),
      await = require('await');

  const User = {
    type: new GraphQLList(UserType),
    args: { ID: { type: GraphQLID } },
    resolve(parent, args) { return Users.find({ ID:args.ID }); }
  };

  const UserAll = {
    type: new GraphQLList(UserType),
    resolve(parent, args) {  return Users.find({Status: 1 }); }
  };
  const GetUserProfile = {
    type: new GraphQLList(UserType),
    args: { UserID: { type: GraphQLInt } },
    async resolve(parent, args) {
      return await Users.find({ Status: 1, ID : args.UserID });
        // return await Users.find({ Status: 1, ID : args.UserID }).then(async (data) => {
        //
        //     if( typeof data[0].isPaidSubscription == "undefined" || data[0].isPaidSubscription == null || !data[0].isPaidSubscription ) {
        //         data[0].PaidSubscription = await SubscriptionList
        //                                          .find({Status : 1 })
        //                                          .then((sub) => { return sub; });
        //     }
        //     // else {
        //     //
        //     // }
        //
        //     // console.log(data);
        //    return await  data; });

    }
  };

  const LoginObject = {
    type: new GraphQLList(UserType),
    args: { Email: { type: GraphQLString },Password: { type: GraphQLString } },
    resolve(parent, args) { return Users.find({ Email:args.Email,Password:args.Password }); }
  };

  const SignInObject = {
      type: new GraphQLList(UserType),
      Description : "user sign in",
      args: { Email: { type: GraphQLEmail },Password: { type: GraphQLString } },
      resolve(parent, args) {
          return Users.find({ Email:args.Email,Status :1, isVerified :1 }).then((result) =>{
            // console.log(result);
              if(result[0].SignUpMethod != "Facebook" && result[0].SignUpMethod != "Google") {
                  return Users.find({ Email:args.Email,Password:args.Password,Status :1, isVerified :1 });
              } else {
                if(result[0].isVerified) {
                  return result;
                } else {
                  return [];
                }
               }
          }).catch((e) => { console.log(e);});
      }
    };



  const FaceBookSignInObject = {
    type: new GraphQLList(UserType),
    Description : "facebook sign in",
    args: { Name: { type: GraphQLString },Email: { type: GraphQLEmail } },
    resolve(parent, args) {
      return Users.find({ Name:args.Name,Email:args.Email,Status :1 })
          .then( (result) =>{
            if(result.length == 0) {
                  let SignUpConstant = new Users({
                          Name: args.Name,
                          Email : args.Email,
                          Description: args.Name+"--"+args.Email,
                          isVerified : true,
                          SignUpMethod : "Facebook",
                          Password : ""
                  });
                  return  SignUpConstant.save().then((res) =>{
                      const testdata = [];
                      testdata.push( res );
                      return testdata;
                   });
            }
            return result;
          });
     }
  };

  const GoogleSignInObject = {
    type: new GraphQLList(UserType),
    Description : "Google sign in",
    args: { Name: { type: GraphQLString },Email: { type: GraphQLEmail } },
    resolve(parent, args) {
      return Users.find({ Name:args.Name,Email:args.Email,Status :1 })
          .then( (result) =>{
            if(result.length == 0) {
                  let SignUpConstant = new Users({
                          Name: args.Name,
                          Email : args.Email,
                          Description: args.Name+"--"+args.Email,
                          isVerified : true,
                          SignUpMethod : "Google",
                          Password : ""
                  });
                  return  SignUpConstant.save().then((res) =>{
                      const testdata = [];
                      testdata.push( res );
                      return testdata;
                   });
            }
            return result;
          });
     }
  };


  const GetTotalUserBalance = {
      type : UserType,
      args : { UserID :  { type: GraphQLInt } },
      resolve( parent, args ) {
        return  Users.findOne({ID : args.UserID},{ _id: false, TotalWalletAmount : true });
      }
  };



  const UserArray = { User , UserAll, LoginObject, SignInObject,FaceBookSignInObject,GoogleSignInObject,GetUserProfile,GetTotalUserBalance };
  module.exports = UserArray;
