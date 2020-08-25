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
const UserSettings = require("../models/user_settings");
const passwordHash = require("password-hash");

module.exports = {
  index: async (root, args, context) => {
    const data = await userQuery({ args: args.filters });

    // let data = await Users.find(findQuery);
    return data;
  },

  upsert: async (root, args, context) => {
    if (get(args.user, "name") && get(args.user, "email")) {
      args.user.description = args.user.name + "--" + args.user.email;
    }

    args.user.uniqueID = uniqid();

    args.user.roleID = RoleObject.user;

    if (get(args.user, "name"))
      args.user.userName = await generateUserName(args.user.name);

    if (get(args.user, "signUpMethod") && get(args.user, "password")) {
      args.user.password = passwordHash.generate(args.user.password);
    }

    let user = {};
    if (args.userId) user = await Users.findOne({ ID: args.userId });

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
    userID: UserID,
    account: {
      name: args.Name,
      email: args.Email,
      userName: args.UserName,
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
  if (get(args, "userIds")) {
    return Users.find({ ID: { $in: get(args, "userIds") } });
  }

  if (get(args, "authorID")) {
    return Users.findOne({ status: 1, ID: args.authorID }).then(
      async (user) => {
        if (user != null) return userDetailsPromise(user, args);
      }
    );
  }

  if (get(args, "authorUserName")) {
    args.authorUserName = args.authorUserName.trim();
    return await Users.findOne({
      status: 1,
      userName: args.authorUserName,
    }).then(async (user) => {
      if (user != null) return userDetailsPromise(user, args);
    });
  }

  if (get(args, "email")) {
    console.log("object111");
    let valid = emailValidator.validate(args.email);
    if (valid) {
      var Result = [];
      await Users.find({
        email: { $regex: new RegExp(`^${args.email}$`, "i") },
        status: 1,
      }).then(async (isEmail) => {
        Result = await isEmail;
        Result = Result.concat(isEmail);
      });
      return await new Set(Result);
    }
  }

  if (get(args, "userId")) {
    return await Users.findOne({ status: 1, ID: args.userId }).then(
      async (user) => {
        return await getFollowerFollowingForUserProfile(user);
      }
    );
  }

  if (get(args, "userName")) {
    return await Users.findOne({ status: 1, userName: args.userName }).then(
      async (user) => {
        return await getFollowerFollowingForUserProfile(user);
      }
    );
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
    following,
    follower,
    freeArticles,
    premiumArticles,
    latestArticles,
    clapedArticles,
    recentlyVisited,
    bookmarkedArticles,
    isFollowing,
    isSubscriptionAllowed,
  ]).then(function (values, i) {
    user.following = values[0];
    user.follower = values[1];
    user.freeArticles = values[2];
    user.premiumArticles = values[3];
    ActivityLog.latestArticles = values[4];
    ActivityLog.clapedArticles = values[5];
    ActivityLog.recentlyVisited = values[6];
    ActivityLog.bookmarkedArticles = values[7];
    user.activityLog = ActivityLog;
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
  user.following = await FollowAuthor.find({
    UserID: user.ID,
    Status: 1,
  }).countDocuments();
  user.follower = await FollowAuthor.find({
    AuthorID: user.ID,
    Status: 1,
  }).countDocuments();
  return [await user];
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
