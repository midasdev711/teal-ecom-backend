const uniqid = require("uniqid");
var AWS = require("aws-sdk"),
  fs = require("fs"),
  { AWSNewCredentials } = require("./aws_constants");

async function UploadBase64OnS3(ImageString, Path, fileName) {
  try {
    AWS.config.setPromisesDependency(require("bluebird"));
    AWS.config.update({
      accessKeyId: AWSNewCredentials.credentials.accessKeyId,
      secretAccessKey: AWSNewCredentials.credentials.secretAccessKey,
      region: AWSNewCredentials.Region,
    });

    var s3Bucket = new AWS.S3();

    const base64Data = new Buffer.from(
      ImageString.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const Extension = ImageString.split(";")[0].split("/")[1];

    fileName = typeof fileName != "undefined" ? fileName : uniqid();

    const params = {
      Bucket: AWSNewCredentials.Bucket,
      Key: `${Path}/${fileName}.${Extension}`, // type is not required
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64", // required
      ContentType: `image/${Extension}`, // required. Notice the back ticks
    };

    let location = "";
    let key = "";
    try {
      const { Location, Key } = await s3Bucket.upload(params).promise();
      location = Location;
      key = Key;
    } catch (error) {
      console.log(error);
    }

    // Save the Location (url) to your database and Key if needs be.
    // As good developers, we should return the url and let other function do the saving to database etc
    console.log(location, key);
    return location;
    // return AWSNewCredentials.AWS_BASE_URL + AWS_KEY;
  } catch (e) {
    console.log(e);
  }
}

module.exports = UploadBase64OnS3;
