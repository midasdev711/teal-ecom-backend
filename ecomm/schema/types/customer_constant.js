
const { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList } = require('graphql');
const { GraphQLEmail, GraphQLPassword } = require('graphql-custom-types');
const { GraphQLDate } = require('graphql-iso-date');


// declared the article category common constant
const CustomerType = new GraphQLObjectType({
    name: 'Customers',
    fields: () => ({
        _id: { type: GraphQLInt },
        ID: { type: GraphQLInt },
        BasicDetailsFullName: { type: GraphQLString, required: true, exists: false },
        BasicDetailsEmail: { type: GraphQLString },
        BasicDetailsMobile: { type: GraphQLString },

        AddressDetailsAddress: { type: GraphQLString },
        AddressDetailsApartment: { type: GraphQLString },
        AddressDetailsCity: { type: GraphQLString },
        AddressDetailsCountry: { type: GraphQLString },
        AddressDetailsPostalCode: { type: GraphQLString },
        AddressDetailsState: { type: GraphQLString },
    })
});

// export all the constants
const CustomerArray = { CustomerType };
module.exports = CustomerArray;
