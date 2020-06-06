/*
  * Created By : Ankita Solace
  * Created Date : 03-12-2019
  * Purpose : all type definations
*/



const { GraphQLObjectType, GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql');
const { GraphQLEmail } = require('graphql-custom-types');
const {  GraphQLDate } = require('graphql-iso-date');
const Categories = require('../../../models/products');



// declared the category common constant
const CategoryType = new GraphQLObjectType({
    name: 'Categories',
    fields: () => ({
        ID: { type: GraphQLInt },
        Name: { type: GraphQLString },
        Description: { type: GraphQLString },
        Status: { type: GraphQLInt },
        Slug: { type: GraphQLString },
        isParent: { type: GraphQLBoolean },
      	FeatureImage : { type: GraphQLString },
        ParentCategoryID : { type : GraphQLInt },
        CreatedDate :  { type : GraphQLDate },
        ModifiedDate :  { type : GraphQLDate },
      	Sequence : { type : GraphQLInt },
        SubCategories : {
          type: new GraphQLList(CategoryType),
          resolve(parent, args){
              return Categories.find({ ParentCategoryID : parent.ID });
          }
        }
    })
});


// export all the constants
const SchemaArray = { CategoryType };
module.exports = SchemaArray;
