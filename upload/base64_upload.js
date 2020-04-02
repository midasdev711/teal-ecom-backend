/*
  * Created By : Ankita Solace
  * Created Date : 02-01-2019
  * Purpose : Base 64 image upload on aws
*/

const uniqid = require('uniqid');
var AWS      = require('aws-sdk'),
    fs       = require('fs'),
    { AWSCredentails }  = require('./aws_constants');



  function  UploadBase64OnS3( ImageString, Path, fileName ) {
      try {
        AWS.config.update({credentials: AWSCredentails.credentials, region: AWSCredentails.Region});
        AWS.config.httpOptions = {timeout: AWSCredentails.Timeout};
        var s3Bucket = new AWS.S3( { params: { Bucket: AWSCredentails.Bucket } } );
            fileName = ( typeof fileName != "undefined") ?  fileName : uniqid();

        var Image = ImageString.split(";"),
            Extension = Image[0].split("/")[1],
            Image = Image[1].replace("base64,",""),
            buf = Buffer.from(Image, 'base64'),
            AWS_KEY = Path+"/"+fileName+"."+Extension;

        var data = {
            Key: AWS_KEY,
            Body: buf,
            ACL: AWSCredentails.ACL,
            ContentEncoding: AWSCredentails.ContentEncoding,
            ContentType: AWSCredentails.ContentType
        };

        s3Bucket.putObject(data, function(err, data){});
        return AWSCredentails.AWS_BASE_URL+AWS_KEY;

      } catch (e) {
        console.log(e);
      }
  }




module.exports = UploadBase64OnS3;
