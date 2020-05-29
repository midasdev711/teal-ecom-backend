/*
  * Created By : Ankita Solace
  * Created Date : 16-12-2019
  * Purpose : Declare all users schema methods
*/

const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean } = require('graphql'),
      {  GraphQLEmail } = require('graphql-custom-types'),
      Creators = require('../../models/creators'),
      { CreatorType } = require('../types/constant'),
      uniqid = require('uniqid'),
      { verifyToken } = require('../middleware/middleware');

  // creator SignUp
  const CreatorSignUp = {
    type : CreatorType,
    args : {
        Name: { type: GraphQLString },
        MobileNo : {type : GraphQLString },
        Email: { type: GraphQLString }
    },
    async resolve(parent, args,context) {
        let CreatorSignUpConstant = new Creators({
                Name: args.Name,
                Email : args.Email,
                Description: args.Name+"--"+args.Email,
                MobileNo : args.MobileNo,
                UniqueID  : uniqid()
        });

        return await CreatorSignUpConstant.save();
    }
  };



  const UsersArray = { CreatorSignUp };
  module.exports = UsersArray;
