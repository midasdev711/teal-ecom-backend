
const MerchantCatgory = require('../../models/merchants');
const { GraphQLObjectType, GraphQLInputObjectType,GraphQLString,GraphQLID,GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList} = require('graphql');
const { GraphQLEmail, GraphQLPassword } = require('graphql-custom-types');
const {  GraphQLDate } = require('graphql-iso-date');


// declared the article category common constant
const MerchantType = new GraphQLObjectType({
    name: 'Merchants',
    fields: () => ({
        _id: {type: GraphQLString},
        ID: { type: GraphQLInt },
        token: { type: GraphQLString },
        refreshToken: { type: GraphQLString },
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Email : { type: new GraphQLNonNull(GraphQLEmail) },
        UserName :{type: GraphQLString },
        Status: { type: GraphQLInt },
        Password: { type: GraphQLString },
        MerchatLogo : {type: GraphQLString },
        isAdminApproved : { type: GraphQLBoolean },
        isEmailVerified : { type: GraphQLBoolean },
        MobileNumber:{ type: new GraphQLNonNull(GraphQLString)},
        VerificationToken :{type: GraphQLString },
        BusinessName :{type: GraphQLString },
        BusinessWebsite :{type: GraphQLString },
        BusinessRegistrationNumber :{type: GraphQLString },
        BusinessPhone :{type: GraphQLString },
        BusinessAddress :{type: GraphQLString },
        BusinessCountry :{type: GraphQLString },
        BusinessState :{type: GraphQLString },
        BusinessCity :{type: GraphQLString },
        BusinessPostalCode :{type: GraphQLString },
        ContactPersonName :{type: GraphQLString },
        ContactPersonEmail :{type: GraphQLEmail },
        ContactPersonPhone :{type: GraphQLString }
    })
});

  // export all the constants
  const MerchantArray = { MerchantType };
  module.exports = MerchantArray;
