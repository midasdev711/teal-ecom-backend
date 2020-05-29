/*
  * Created By : Ankita Solace
  * Created Date : 08-11-2019
  * Purpose : Declare all constants
*/



const MAIL_DETAILS = {
    "service" : "gmail",
    "Port" : 443,
    "User" : "solace.pune1@gmail.com",
    "Password" :'Solace@2020',
    // "HTTP_RESET_URL" : "http://localhost/demo/node_mail.html"
    // "HTTP_RESET_URL" : "http://localhost:3000/resetpassword"
    "HTTP_RESET_URL" : "https://teal.com/resetpassword"
};


const AWSCredentails = {
    credentials : {
      accessKeyId: "AKIAVHYRQR3GKO5SU24Z",
      secretAccessKey : "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"
    },
    Region: 'us-east-2',
    Timeout : 5000,
    Bucket: 'teal-cdn',
    ContentEncoding: 'base64',
    ContentType: 'image/png',
    ACL: "public-read-write",
    // AWS_BASE_URL : "https://teal.s3.us-east-2.amazonaws.com/",
    AWS_BASE_URL : "http://cdn.teal.com/",
    AWS_USER_IMG_PATH : "users",
    AWS_SHOP_IMG_PATH : "shop",
    AWS_STORIES_IMG_PATH : "stories",
    AWS_UI_IMG_PATH : "frontend/images",
};



const LocalFolderImagePath = 'images',
      UserLocalImagePath = 'avatar',
      RoleObject = {  "admin" : 1, "moderator" : 2, "user":3 },
      ArticleStatusConst = DonationStatusConst = { "inActive" : 0,"Active" : 1, "Approved" : 2,  "Rejected" : 3 },
      AmountType = { Credit : "Credit", Debit : "Debit" },
      PremiumContentLen = 100,
      TitleMaxLen = 125,
      SubTitleMaxLen = 150,
      SubscribeCdnUrl = "http://cdn.teal.com/subscribe.jpg",
      TOKEN_SECRET_KEY = "5myg3NmusbIH1pSUhsnhTM33aa5rqR4d";

  const ConstantArray = { TOKEN_SECRET_KEY,SubTitleMaxLen, TitleMaxLen,AWSCredentails,SubscribeCdnUrl,PremiumContentLen,AmountType, MAIL_DETAILS,LocalFolderImagePath,UserLocalImagePath, ArticleStatusConst,RoleObject,DonationStatusConst };
  module.exports = ConstantArray;
