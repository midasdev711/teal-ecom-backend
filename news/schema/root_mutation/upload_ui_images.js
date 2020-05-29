const { GraphQLID,GraphQLList , GraphQLString,GraphQLInt }= require('graphql'),
      await = require('await'),
      { ProfileImageInfo } = require('../types/constant'),
      { AWSCredentails } = require('../constant'),
      UploadBase64OnS3 = require('../../../upload/base64_upload'),
      async = require("async"),
      { verifyToken } = require('../middleware/middleware');


const UploadUIImages = {
    type: ProfileImageInfo,
    args: {
       ImageBase64 : { type : GraphQLString },
       ImagePath : { type : GraphQLString }
     },
     resolve: async (parent, args, context) => {
      const id = await verifyToken(context);
      var data = {};
      if( typeof args.ImagePath == "undefined")
          args.ImagePath = AWSCredentails.AWS_UI_IMG_PATH
      data.Avatar =  await UploadBase64OnS3( args.ImageBase64, args.ImagePath );
      return await data;
    }
};


  module.exports = { UploadUIImages };
