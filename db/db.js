const mongoose = require("mongoose");
function connectWithMongodb() {
  mongoose.connect(
    "mongodb+srv://fuckcovid:Li5D0vvZTVvyo0V9@cluster0.oml6y.mongodb.net/teal?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    (error) => {
      if (!error) {
        console.log("Connection with mongodb is successfully establish");
        return true;
      }
      console.log("Error while connect with mongo db ", JSON.stringify(error));
      return false;
    }
  );
}

connectWithMongodb();

//----------------------------------News schema---------------------------------------------

require("../news/src/models/api_key");
require("../news/src/models/article_click_details");
require("../news/src/models/article_rating");
require("../news/src/models/articles");
require("../news/src/models/block_author");
require("../news/src/models/bookmarks");
require("../news/src/models/categories");
require("../news/src/models/creators");
require("../news/src/models/donation_transaction");
require("../news/src/models/email_logs");
require("../news/src/models/follow_author");
require("../news/src/models/forgot_passwords_log");
require("../news/src/models/notifications");
require("../news/src/models/report_article");
require("../news/src/models/roles");
require("../news/src/models/sites");
require("../news/src/models/subscription_list");
require("../news/src/models/user_settings");
require("../news/src/models/user_wallet_balance");
require("../news/src/models/users");
require("../news/src/models/users_categories");
require("../news/src/models/users_paid_subscription_logs");
require("../news/src/models/users_paid_subscriptions");

//-------------------------------Ecomm Schemas---------------------------------------------

require("../ecomm/src/models/admin");
require("../ecomm/src/models/attributes");
require("../ecomm/src/models/merchants");
require("../ecomm/src/models/merchants_business");
require("../ecomm/src/models/merchats_contacts");
require("../ecomm/src/models/order");
require("../ecomm/src/models/product_attributes");
require("../ecomm/src/models/product_reviews");
require("../ecomm/src/models/product_types");
require("../ecomm/src/models/product_variants");
require("../ecomm/src/models/products");
require("../ecomm/src/models/shopping_cart");
require("../ecomm/src/models/shopping_cart_detail");
require("../ecomm/src/models/customers");
