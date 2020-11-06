
const { GraphQLString, GraphQLInt} = require('graphql');

// declared the blog constant
const BlogType = new GraphQLObjectType({
    name: 'Blogs',
    fields: () => ({
        _id: { type: GraphQLInt },
        ID: { type: GraphQLInt },
        BlogTitle: { type: GraphQLString, required: true, exists: false },
        BlogPublishingPlace: { type: GraphQLString },
        BlogCategory: { type: GraphQLString },Blog
        BlogPicture: { type: GraphQLString },
        BlogUserID: { type: GraphQLInt }
    })
});

// export all the constants
const BlogArray = { BlogType };
module.exports = BlogArray;
