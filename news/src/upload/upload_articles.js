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

    fileName = typeof fileName != "undefined" ? fileName : uniqid();

    const params = {
      Bucket: AWSNewCredentials.Bucket,
      Key: `${Path}/${fileName}`, // type is not required
      ACL: "public-read",
      Body: bufferObject,
      ContentType: "application/json", // required. Notice the back ticks
    };
    let articlesData;
    s3Bucket.putObject(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        articlesData = data;
      }
    });

    // Save the Location (url) to your database and Key if needs be.
    // As good developers, we should return the url and let other function do the saving to database etc
    console.log(articlesData);
    return articlesData;
    // return AWSNewCredentials.AWS_BASE_URL + AWS_KEY;
  } catch (e) {
    console.log(e);
  }
}

module.exports = UploadArticlesOnS3;
