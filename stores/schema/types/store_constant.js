
const { GraphQLString, GraphQLInt} = require('graphql');

// declared the store constant
const StoreType = new GraphQLObjectType({
    name: 'Stores',
    fields: () => ({
        _id: { type: GraphQLInt },
        ID: { type: GraphQLInt },
        StoreTitle: { type: GraphQLString, required: true, exists: false },
        StoreDescription: { type: GraphQLString, required: true },
		StoreCategory: { type: GraphQLString, required: true},
		StoreUserName: { type: GraphQLString, required: true},
		StoreEmail: { type: GraphQLString },
		StorePhone: { type: GraphQLString },
		StoreWebsite: { type: GraphQLString },
		StoreLocation: { type: GraphQLString },
		StoreUserID: { type: GraphQLInt }.
		StorePageID: { type: GraphQLInt }
    })
});

// export all the constants
const StoreArray = { StoreType };
module.exports = StoreArray;

