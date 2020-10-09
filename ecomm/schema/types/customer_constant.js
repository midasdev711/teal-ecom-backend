
const { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList } = require('graphql');
const { GraphQLEmail, GraphQLPassword } = require('graphql-custom-types');
const { GraphQLDate } = require('graphql-iso-date');


// declared the article category common constant
const CustomerType = new GraphQLObjectType({
    name: 'Customers',
    fields: () => ({
        _id: { type: GraphQLInt },
        ID: { type: GraphQLInt },
        BasicDetailsFirstName: { type: GraphQLString, required: true, exists: false },
        BasicDetailsLastName: { type: GraphQLString },
        BasicDetailsEmail: { type: GraphQLString },
        BasicDetailsMobile: { type: GraphQLString },
        BasicDetailsEmailFlag: { type: GraphQLBoolean },


        AddressDetailsFirstName: { type: GraphQLString },
        AddressDetailsLastName: { type: GraphQLString },
        AddressDetailsCompany: { type: GraphQLString },
        AddressDetailsApartment: { type: GraphQLString },
        AddressDetailsCity: { type: GraphQLString },
        AddressDetailsCountry: { type: GraphQLString },
        AddressDetailsPostalCode: { type: GraphQLString },
        AddressDetailsMobile: { type: GraphQLString },

        Tax: { type: GraphQLString },
        Notes: { type: GraphQLEmail },
        Tags: { type: GraphQLString },
    })
});

// export all the constants
const CustomerArray = { CustomerType };
module.exports = CustomerArray;
