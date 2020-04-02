/*
  * Created By : Ankita Solace
  * Created Date : 30-10-2019
  * Purpose : Declare all article UserCategory schema methods
*/


const UserCategory = require('../../models/users_categories');
const { UserCategoryType } = require('../types/constant');
const {  GraphQLInt,GraphQLNonNull,GraphQLList } = require('graphql');

  const AddUserCategory = {
      type: UserCategoryType,
      args : {
        CategoryID: { type:new GraphQLList(GraphQLInt) },
        UserID: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        console.log(args);
          let UserCategoryConstant = new UserCategory({ CategoryID: args.CategoryID,UserID: args.UserID });
          UserCategory.updateOne(
                {$and: [{ UserID: args.UserID },{ Status: 1 }]},
                { $set: { Status: 0 ,ModifiedDate: Date.now()} },
                { upsert: true }
          );
          return UserCategoryConstant.save();


          // return UserCategory.findOne({$and: [{  CategoryID: args.CategoryID },{ UserID: args.UserID },{Status:1}]})
          //   .then(result => {
          //       if(result == null) {   return UserCategoryConstant.save(); }
          //       else {
          //             return UserCategory.updateOne(
          //                   {$and: [{ UserID: args.UserID },{ Status: 1 }]},
          //                   { $set: { Status: 0 ,ModifiedDate: Date.now()} },
          //                   { upsert: true }
          //             ).then(results => { return results; })
          //             .catch( errs => {return errs})
          //         }
          //   })
          //   .catch(err => {return err})
      }
  };



  const UserCagtegoryArray = { AddUserCategory };
  module.exports = UserCagtegoryArray;
