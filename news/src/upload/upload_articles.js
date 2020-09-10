const uniqid = require("uniqid");
var AWS = require("aws-sdk"),
  { AWSNewCredentials } = require("./aws_constants");

async function UploadArticlesOnS3(jsonFileContent, Path, fileName) {
  try {
    AWS.config.update({
      accessKeyId: AWSNewCredentials.credentials.accessKeyId,
      secretAccessKey: AWSNewCredentials.credentials.secretAccessKey,
      region: AWSNewCredentials.Region,
    });

    var s3Bucket = new AWS.S3();
    console.log("uploadJSONFileOnS3Bucket function started");
    var bufferObject = new Buffer.from(JSON.stringify(jsonFileContent));

    fileName = uniqid();

    const params = {
      Bucket: AWSNewCredentials.Bucket,
      Key: `${Path}/${fileName}`, // type is not required
      ACL: "public-read",
      Body: bufferObject,
      ContentType: "application/json", // required. Notice the back ticks
    };
    let location = "";
    let key = "";
    try {
      const data = await s3Bucket.putObject(params).promise();
      console.log(data, "dfdfdfdffdf");
      location = data;
      // key = Key;
    } catch (error) {
      console.log(error);
    }
    console.log("hello", location, key);
    return location;
  } catch (e) {
    console.log(e);
  }
}

module.exports = UploadArticlesOnS3;
