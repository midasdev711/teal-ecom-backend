var client = (client1 = client2 = "");

const ImagePath = {
  SERVER_IMG_URL: "http://socialenginespecialist.com/PuneDC/slang/",
  // SERVER_IMG_URL : "https://1343065830.rsc.cdn77.org/",
  LOCAL_IMG_FEATURE_PATH: "ecomm/product_feature",
  LOCAL_IMG_THUMB_PATH: "ecomm/thumbnail",
  SERVER_IMG_FOLDER: "/slang/",
  IMG_ARRAY: "ecomm/arrayImg",
  // SERVER_IMG_FOLDER : "/www/"
};

const MAIL_DETAILS = {
  service: "gmail",
  Port: 443,
  User: "mohitmali759@gmail.com",
  Password: "account@321",
  // "HTTP_RESET_URL" : "http://localhost/demo/node_mail.html"
  // "HTTP_RESET_URL" : "http://localhost:3000/resetpassword"
  HTTP_RESET_URL: "https://juicypie.com/resetpassword",
};

const StatusConst = { inActive: 0, Active: 1, Approved: 2, Rejected: 3 };

const BASE_URL = "http://115.166.143.10:3009/";

const EmailCredentials = {
  USER_NAME: "mukesh.yashco17@gmail.com",
  PASSWORD: "Yashyashco@52",
};

const STRIPE_KEY = "sk_test_0SvBsJ6wV1eDvwoBnWNshDf7002leQIWgB"; //"sk_test_gWHaEB22LdcNtRzPyY9JmxmJ00fs4XzILl";

const NMI_KEY = "6457Thfj624V5r7WUwc5v6a68Zsd6YEm";

const NMI_MERCHAT_URL = "https://secure.networkmerchants.com/api/transact.php";

const AUTHORIZE_NAME = "49N2ntFRg ";
const AUTHORIZE_TRANSACTION_KEY = "6yEQ27c8hF6W8UCr";
const RoleObject = { admin: 1, moderator: 2, user: 3 };

const ArticleStatusConst = (DonationStatusConst = {
  inActive: 0,
  Active: 1,
  Approved: 2,
  Rejected: 3,
});

const ConstantArray = {
  StatusConst,
  ImagePath,
  client,
  client1,
  EmailCredentials,
  BASE_URL,
  STRIPE_KEY,
  NMI_KEY,
  NMI_MERCHAT_URL,
  AUTHORIZE_NAME,
  AUTHORIZE_TRANSACTION_KEY,
  RoleObject,
  MAIL_DETAILS,
  ArticleStatusConst,
};

module.exports = ConstantArray;
