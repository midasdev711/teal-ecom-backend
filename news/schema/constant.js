/*
  * Created By : Ankita Solace
  * Created Date : 08-11-2019
  * Purpose : Declare all constants
*/



const MAIL_DETAILS = {
    "service" : "gmail",
    "Port" : 443,
    "User" : "solace.pune1@gmail.com",
    "Password" :'solace@123',
    // "HTTP_RESET_URL" : "http://localhost/demo/node_mail.html"
    "HTTP_RESET_URL" : "http://localhost:3000/resetpassword"
};


const LocalFolderImagePath = 'images',
      UserLocalImagePath = 'avatar',
      RoleObject = {  "admin" : 1, "moderator" : 2, "user":3 },
      ArticleStatusConst = DonationStatusConst = { "inActive" : 0,"Active" : 1, "Approved" : 2,  "Rejected" : 3 },
      AmountType = { Credit : "Credit", Debit : "Debit" },
      PremiumContentLen = 100,
      SubscribeCdnUrl = "http://cdn.jointeal.com.global.prod.fastly.net/subscribe.jpg";

  const ConstantArray = { SubscribeCdnUrl,PremiumContentLen,AmountType, MAIL_DETAILS,LocalFolderImagePath,UserLocalImagePath, ArticleStatusConst,RoleObject,DonationStatusConst };
  module.exports = ConstantArray;
