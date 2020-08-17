const Users = require("../models/users");
const EmailLogs = require("../models/email_logs");
const Articles = require("../models/articles");
const ArticleRatings = require("../models/article_rating");
const ArticleClickDetails = require("../models/article_click_details");
const ArticleBookmarks = require("../models/bookmarks");
const ForgotPasswordLogs = require("../models/forgot_passwords_log");
const UsersPaidSubscriptions = require("../models/users_paid_subscriptions");
const FollowAuthor = require("../models/follow_author");
const { GraphQLEmail } = require("graphql-custom-types");
const { ArticleStatusConst, RoleObject } = require("../constant");
const { generateToken, verifyToken } = require("../middleware/middleware");
const emailValidator = require("email-validator");
const uniqid = require("uniqid");
const { get } = require("lodash");
const sendMailToUser = require("../mail/signup");
const UserSettings = require("../../models/user_settings");
const passwordHash = require("password-hash");

module.exports = {
  index: async (root, args, context) => {
    let id = {};
    if (context.headers.authorization) {
      id = await verifyToken(context);
    }

    if (id.UserID) {
      args.UserID = id.UserID;
    }

    const data = await userQuery({ args: args.filters });

    // let data = await Users.find(findQuery);
    return data;
  },

  upsert: async (root, args, context) => {
    let id = {};
    if (context.headers.authorization) {
      id = await verifyToken(context);
    }

    if (id.UserID) {
      args.user.ID = id.UserId;
    }

    if (get(args.user, "Name") && get(args.user, "Email")) {
      args.user.Description = args.user.Name + "--" + args.user.Email;
    }

    args.user.UniqueID = uniqid();

    args.user.RoleID = RoleObject.user;

    if (get(args.user, "Name"))
      args.user.UserName = await generateUserName(args.user.Name);

    if (get(args.user, "SignUpMethod") && get(args.user, "Password")) {
      args.user.Password = passwordHash.generate(args.user.Password);
    }

    let user = {};
    if (args.UserId) user = await Users.findOne({ ID: args.UserId });

    if (get(user, "name")) {
      return Users.update(args.user);
    } else {
      UserData = await Users.create(args.user);
      SaveUserSettings(args.user, UserData.ID);
      return await generateToken(UserData);
    }
  },
};

async function SaveUserSettings(args, UserID) {
  let UserSettingsConstant = new UserSettings({
    UserID: UserID,
    Account: {
      Name: args.Name,
      Email: args.Email,
      UserName: args.UserName,
    },
  });

  await UserSettingsConstant.save();
}

async function generateUserName(FullName) {
  FullName =
    (await FullName.trim().replace(/ /g, "-")) + "-" + (await makeid(4));
  return await FullName.toLowerCase();
}

async function makeid(length) {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  // console.log(result,"result");

  return await result;
}

const userQuery = async ({ args }) => {
  if (get(args, "AuthorID")) {
    return await Users.findOne({ Status: 1, ID: args.AuthorID }).then(
      async (user) => {
        if (user != null) return userDetailsPromise(user, args);
      }
    );
  }

  if (get(args, "AuthorUserName")) {
    args.AuthorUserName = args.AuthorUserName.trim();
    return await Users.findOne({
      Status: 1,
      UserName: args.AuthorUserName,
    }).then(async (user) => {
      if (user != null) return userDetailsPromise(user, args);
    });
  }

  if (get(args.Email)) {
    let valid = emailValidator.validate(args.Email);
    if (valid) {
      var Result = [];
      await Users.find(
        { Email: { $regex: new RegExp(`^${args.Email}$`, "i") }, Status: 1 },
        { _id: false, UniqueID: true, Email: true }
      ).then(async (isEmail) => {
        Result = await isEmail;
        Result = Result.concat(isEmail);
      });
      return await new Set(Result);
    }
  }

  if (get(args, "UserId")) {
    return await Users.findOne({ Status: 1, ID: args.UserID }).then(
      async (user) => {
        return await getFollowerFollowingForUserProfile(user);
      }
    );
  }

  if (get(args, "UserName")) {
    return await Users.findOne({ Status: 1, UserName: args.UserName }).then(
      async (user) => {
        return await getFollowerFollowingForUserProfile(user);
      }
    );
  }

  if (get(args, "AuthorUserName")) {
    args.AuthorUserName = args.AuthorUserName.trim();
    return await Users.findOne({
      Status: 1,
      UserName: args.AuthorUserName,
    }).then(async (user) => {
      if (user != null) return userDetailsPromise(user, args);
    });
  }
};

async function userDetailsPromise(user, args) {
  const Following = FollowAuthor.find({
    UserID: user.ID,
    Status: 1,
    isFollowed: true,
  }).countDocuments();
  const Follower = FollowAuthor.find({
    AuthorID: user.ID,
    Status: 1,
    isFollowed: true,
  }).countDocuments();
  const FreeArticles = Articles.find({
    AuthorID: user.ID,
    Status: 2,
    ArticleScope: 1,
  });
  const PremiumArticles = Articles.find({
    AuthorID: user.ID,
    Status: 2,
    ArticleScope: 2,
  });
  const LatestArticles = getLatestArticles(args, user);
  const ClapedArticles = getAuthorsClapedArticle(args, user);
  const RecentlyVisited = getRecentlyVisitedArticle(args, user);
  const BookmarkedArticles = getBookmarkedArticle(args, user);
  const isFollowing = FollowAuthor.findOne({
    AuthorID: user.ID,
    Status: 1,
    UserID: args.UserID,
    isFollowed: true,
  }).countDocuments();

  const isSubscriptionAllowed = UsersPaidSubscriptions.findOne({
    $and: [
      { AuthorID: user.ID },
      { Status: { $ne: 0 } },
      { UserID: args.UserID },
      { EndDate: { $gte: new Date() } },
    ],
  }).countDocuments();
  const ActivityLog = {};
  return Promise.all([
    Following,
    Follower,
    FreeArticles,
    PremiumArticles,
    LatestArticles,
    ClapedArticles,
    RecentlyVisited,
    BookmarkedArticles,
    isFollowing,
    isSubscriptionAllowed,
  ]).then(function (values, i) {
    user.Following = values[0];
    user.Follower = values[1];
    user.FreeArticles = values[2];
    user.PremiumArticles = values[3];
    ActivityLog.LatestArticles = values[4];
    ActivityLog.ClapedArticles = values[5];
    ActivityLog.RecentlyVisited = values[6];
    ActivityLog.BookmarkedArticles = values[7];
    user.ActivityLog = ActivityLog;
    user.isFollowing = values[8] == 1;
    user.isSubscriptionAllowed = values[9] > 0;
    return user;
  });
}

async function getLatestArticles(args, user) {
  let options = {
    limit: 10,
    page: 1,
    $sort: {
      ID: -1,
    },
  };
  return Articles.paginate({ AuthorID: user.ID, Status: 2 }, options);
}

async function getAuthorsClapedArticle(args, user) {
  let options = {
    limit: args.limit || 10,
    page: args.page || 1,
    $sort: {
      CreatedDate: -1,
    },
  };
  return ArticleRatings.paginate({ UserID: user.ID }, options).then(
    (ratings) => {
      if (ratings.docs.length > 0)
        return Articles.find({
          ID: { $in: ratings.docs.map((rating) => rating.ArticleID) },
        });
      else return [];
    }
  );
}

async function getRecentlyVisitedArticle(args, user) {
  let options = {
    limit: args.limit || 10,
    page: args.page || 1,
    $sort: {
      CreatedDate: -1,
      VisitedDate: -1,
    },
  };
  return ArticleClickDetails.paginate({ UserID: user.ID }, options).then(
    (clicked) => {
      if (clicked.docs.length > 0)
        return Articles.find({
          ID: { $in: clicked.docs.map((click) => click.ArticleID) },
        });
      else return [];
    }
  );
}

async function getBookmarkedArticle(args, user) {
  let options = {
    limit: args.limit || 10,
    page: args.page || 1,
    $sort: {
      CreatedDate: -1,
    },
  };
  return ArticleBookmarks.find({ UserID: user.ID, Status: 1 }, options).then(
    (bookmarks) => {
      if (bookmarks.docs.length > 0)
        return Articles.find({
          ID: { $in: bookmarks.map((bookmark) => bookmark.ArticleID) },
        });
      else return [];
    }
  );
}

async function getFollowerFollowingForUserProfile(user) {
  user.Following = await FollowAuthor.find({
    UserID: user.ID,
    Status: 1,
  }).countDocuments();
  user.Follower = await FollowAuthor.find({
    AuthorID: user.ID,
    Status: 1,
  }).countDocuments();
  return await user;
}

const formatString = (str) => {
  return str
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "")
    .trim()
    .replace(/[^a-zA-Z0-9-. ]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
};
