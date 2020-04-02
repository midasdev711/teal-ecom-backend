const Variants = require('../../models/product_variants');
const { VariantsType } = require('../types/product_variant_constant');
const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt }= require('graphql');



/**
    * get variant details by product id
    * @param {$_id} userid
    * @returns {userlist Array}
    */

const VariantsByProductID = {
  type: new GraphQLList(VariantsType),
  args: { ProductID: {type: GraphQLString } },
  resolve : async (parent, args) => {
    const variants = await  Variants.find({ ProductID: args.ProductID });
  
    return variants;
  }
};


const VariantArray = { VariantsByProductID };

module.exports = VariantArray;
