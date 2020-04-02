
const ProductReview = require('../../models/product_reviews');
const { GraphQLObjectType, GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql');
const {  GraphQLDate } = require('graphql-iso-date');


// declared the article category common constant
const ProductReviewRatingType = new GraphQLObjectType({
    name: 'ProductsReviewRating',
    fields: () => ({
        _id: {type: GraphQLString},
        productId :{type :GraphQLString },
        userId:{type: GraphQLString },
        rating : {type: GraphQLInt},
        reviewDetails : {type: GraphQLString },
        isAdminApproved: { type: GraphQLBoolean },
        CreatedDate:{ type: GraphQLDate},
        userName:{ type: GraphQLString},
        productName:{ type: GraphQLString}
    })
});

  // export all the constants
  const ProductArray = { ProductReviewRatingType };
  module.exports = ProductArray;
