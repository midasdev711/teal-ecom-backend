/*
  * Created By : Ankita Solace
  * Created Date : 30-10-2019
  * Purpose : Declare all article UserCategory schema methods
*/


const UserCategory = require('../../models/users_categories'),
      { UserCategoryType } = require('../types/constant'),
      {  GraphQLInt,GraphQLNonNull,GraphQLList } = require('graphql');

      // add users categories
  const AddUserCategory = {
      type: UserCategoryType,
      args : {
        CategoryID: { type:new GraphQLList(GraphQLInt) },
        UserID: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
          let UserCategoryConstant = new UserCategory({ CategoryID: args.CategoryID,UserID: args.UserID });
          UserCategory.updateOne(
                {$and: [{ UserID: args.UserID },{ Status: 1 }]},
                { $set: { Status: 0 ,ModifiedDate: Date.now()} },
                { upsert: true }
          );
          return UserCategoryConstant.save();
      }
  };

  module.exports = { AddUserCategory };
