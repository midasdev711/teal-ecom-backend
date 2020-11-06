
const { GraphQLString, GraphQLInt} = require('graphql');

// declared the blog constant
const PageType = new GraphQLObjectType({
    name: 'Pages',
    fields: () => ({
        _id: { type: GraphQLInt },
        ID: { type: GraphQLInt },
        PageTitle: { type: GraphQLString, required: true, exists: false },
        PageDescription: { type: GraphQLString, required: true },
		PageCategory: { type: GraphQLString, required: true},
		PageUserName: { type: GraphQLString, required: true},
		PageEmail: { type: GraphQLString },
		PagePhone: { type: GraphQLString },
		PageWebsite: { type: GraphQLString },
		PageLocation: { type: GraphQLString },
		PageUserID: { type: GraphQLInt }
    })
});

// export all the constants
const PageArray = { PageType };
module.exports = PageArray;

