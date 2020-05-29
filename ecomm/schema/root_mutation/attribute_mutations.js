const Attributes = require('../../models/attributes');
const { AttributesType } = require('../types/attributes_constant');
const { AdminType } = require('../types/admin_constant');
const { GraphQLObjectType,GraphQLJSON, GraphQLEnumType, GraphQLInputObjectType,GraphQLFloat,GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql');
const {  GraphQLDate } = require('graphql-iso-date');
const { StatusConst,ImagePath } = require("../../constant");
const { verifyToken } = require('../middleware/middleware');

/**
    * Add attributes
    * @param {$admin_email} email
    * @param {$admin_password}  password
    * @returns {adminDetails Array}
    */

const AddAttributes = {
  type : AttributesType,
  args : {
    _id:{type: GraphQLString },
    MerchantId:{type: GraphQLInt },
    AttributsName : {  type: GraphQLString },
    AttributeValues:{type: new GraphQLList(GraphQLString) },
    ProductType : { type : GraphQLString }
  },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
             if(args._id){
              return await Attributes.findOneAndUpdate(
                     { _id: args._id},
                     { $set: { AttributeValues: args.AttributeValues,AttributsName: args.AttributsName,ProductType: args.ProductType}
                     }).catch(err => new Error(err));
             } else {
             let AttributesConstant = new Attributes({
                        MerchantId: args.MerchantId,
                        AttributsName: args.AttributsName,
                        AttributeValues: args.AttributeValues,
                        ProductType: args.ProductType
                });
            let attributes = await AttributesConstant.save();
            return attributes;
          }
    }
};

const RemoveAttributes = {
  type : AttributesType,
  args : {
    _id:{type: GraphQLString },
    MerchantId:{type: GraphQLInt }
  },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
             if(args._id){
              return await Attributes.findOneAndDelete(
                     { _id: args._id,MerchantId:args.MerchantId
                     }).catch(err => new Error(err));
                } 
           }
     };

const AttributesArray = { AddAttributes,RemoveAttributes};
module.exports = AttributesArray;
