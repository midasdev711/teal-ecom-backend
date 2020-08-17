const Users = require("../../models/users"),
  EmailLogs = require("../../models/email_logs"),
  Articles = require("../../models/articles"),
  ArticleRatings = require("../../models/article_rating"),
  ArticleClickDetails = require("../../models/article_click_details"),
  ArticleBookmarks = require("../../models/bookmarks"),
  ForgotPasswordLogs = require("../../models/forgot_passwords_log"),
  UsersPaidSubscriptions = require("../../models/users_paid_subscriptions"),
  { TableInfo, UserType, PasswordInfo } = require("../types/constant"),
  {
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInputObjectType,
  } = require("graphql"),
  FollowAuthor = require("../../models/follow_author"),
  { GraphQLEmail } = require("graphql-custom-types"),
  { RoleObject, StatusConstant, ArticleStatusConst } = require("../constant"),
  { generateToken, verifyToken } = require("../middleware/middleware"),
  { AuthPayloadType } = require("../types/authorise"),
  passwordHash = require("password-hash"),
  emailValidator = require("email-validator");

// get user profile details
const GetUserProfile = {
  type: UserType,
  args: {
    UserID: { type: GraphQLInt },
    UserName: { type: GraphQLString },
  },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    if (id.UserID) args.UserID = id.UserID;
    if (
      typeof args.UserID != "undefined" &&
      args.UserID != "" &&
      args.UserID != 0
    ) {
      return await Users.findOne({ Status: 1, ID: args.UserID }).then(
        async (user) => {
          return await getFollowerFollowingForUserProfile(user);
        }
      );
    }

    if (
      typeof args.UserName != "undefined" &&
      args.UserName != "" &&
      args.UserName != 0
    ) {
      return await Users.findOne({ Status: 1, UserName: args.UserName }).then(
        async (user) => {
          return await getFollowerFollowingForUserProfile(user);
        }
      );
    }
  },
};

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

const LimitOffset = new GraphQLInputObjectType({
  name: "LogLimitOffset",
  fields: () => ({
    limit: { type: GraphQLInt },
    offset: { type: GraphQLInt },
  }),
});

const ActivityLogInput = new GraphQLInputObjectType({
  name: "ActivityLogInput",
  fields: () => ({
    LatestArticles: { type: LimitOffset },
    ClapedArticles: { type: LimitOffset },
    RecentlyVisited: { type: LimitOffset },
    BookmarkedArticles: { type: LimitOffset },
  }),
});

// get author profile details
const GetAuthorProfileDetails = {
  type: UserType,
  args: {
    AuthorID: { type: GraphQLInt },
    UserID: { type: GraphQLInt },
    AuthorUserName: { type: GraphQLString },
    ActivityLog: { type: ActivityLogInput },
  },
  resolve: async (parent, args, context) => {
    let id = "";
    if (context.headers.authorization) {
      id = await verifyToken(context);
    }

    if (id.UserID) args.UserID = id.UserID;
    if (
      typeof args.AuthorID != "undefined" &&
      args.AuthorID != "" &&
      args.AuthorID != 0
    ) {
      return await Users.findOne({ Status: 1, ID: args.AuthorID }).then(
        async (user) => {
          if (user != null) return userDetailsPromise(user, args);
        }
      );
    }

    if (
      typeof args.AuthorUserName != "undefined" &&
      args.AuthorUserName != "" &&
      args.AuthorUserName != 0
    ) {
      args.AuthorUserName = args.AuthorUserName.trim();
      return await Users.findOne({
        Status: 1,
        UserName: args.AuthorUserName,
      }).then(async (user) => {
        if (user != null) return userDetailsPromise(user, args);
      });
    }
  },
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
  // console.log(" user.ID===>", user.ID,"args.UserID===>",args.UserID);

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
  let limit = 5,
    offset = 0;
  if (typeof args.ActivityLog != "undefined") {
    if (typeof args.ActivityLog.LatestArticles != "undefined") {
      (limit = args.ActivityLog.LatestArticles.limit),
        (offset = args.ActivityLog.LatestArticles.offset * limit);
    }
  }
  return Articles.find({ AuthorID: user.ID, Status: 2 })
    .sort({ ID: -1 })
    .skip(offset)
    .limit(limit);
}

async function getAuthorsClapedArticle(args, user) {
  let limit = 5,
    offset = 0;
  if (typeof args.ActivityLog != "undefined") {
    if (typeof args.ActivityLog.ClapedArticles != "undefined") {
      (limit = args.ActivityLog.ClapedArticles.limit),
        (offset = args.ActivityLog.ClapedArticles.offset * limit);
    }
  }
  return ArticleRatings.find({ UserID: user.ID })
    .sort({ CreatedDate: -1 })
    .skip(offset)
    .limit(limit)
    .then((ratings) => {
      if (ratings.length > 0)
        return Articles.find({
          ID: { $in: ratings.map((rating) => rating.ArticleID) },
        });
      else return [];
    });
}

async function getRecentlyVisitedArticle(args, user) {
  let limit = 5,
    offset = 0;
  if (typeof args.ActivityLog != "undefined") {
    if (typeof args.ActivityLog.RecentlyVisited != "undefined") {
      (limit = args.ActivityLog.RecentlyVisited.limit),
        (offset = args.ActivityLog.RecentlyVisited.offset * limit);
    }
  }
  return ArticleClickDetails.find({ UserID: user.ID })
    .sort({ CreatedDate: -1 })
    .sort({ VisitedDate: -1 })
    .skip(offset)
    .limit(limit)
    .then((clicked) => {
      if (clicked.length > 0)
        return Articles.find({
          ID: { $in: clicked.map((click) => click.ArticleID) },
        });
      else return [];
    });
}

async function getBookmarkedArticle(args, user) {
  let limit = 5,
    offset = 0;
  if (typeof args.ActivityLog != "undefined") {
    if (typeof args.ActivityLog.BookmarkedArticles != "undefined") {
      (limit = args.ActivityLog.BookmarkedArticles.limit),
        (offset = args.ActivityLog.BookmarkedArticles.offset * limit);
    }
  }
  return ArticleBookmarks.find({ UserID: user.ID, Status: 1 })
    .sort({ CreatedDate: -1 })
    .skip(offset)
    .limit(limit)
    .then((bookmarks) => {
      if (bookmarks.length > 0)
        return Articles.find({
          ID: { $in: bookmarks.map((bookmark) => bookmark.ArticleID) },
        });
      else return [];
    });
}

// get user by id
const GetUserByID = {
  type: UserType,
  args: { UserID: { type: GraphQLInt } },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    if (id.UserID) args.UserID = id.UserID;
    return Users.findOne({ Status: 1, ID: args.UserID });
  },
};

// get rewards progress
const RewardsProgress = {
  type: TableInfo,
  args: { UserID: { type: GraphQLInt } },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    var Object = {};
    if (id.UserID) args.UserID = id.UserID;
    return Users.findOne(
      { ID: args.UserID, Status: 1 },
      { _id: false, UniqueID: true }
    ).then(async (res) => {
      await Users.find({ ReferenceID: res.UniqueID })
        .countDocuments()
        .then((t) => {
          if (t != null) Object.count = t;
        });
      return await Object;
    });
  },
};

// user login
const LoginObject = {
  type: new GraphQLList(UserType),
  args: { Email: { type: GraphQLString }, Password: { type: GraphQLString } },
  resolve(parent, args) {
    return Users.find({ Email: args.Email, Password: args.Password });
  },
};

// check is email or mobile no exists or not
const IsEmailExist = {
  type: new GraphQLList(UserType),
  Description: "ReturnUniqueID",
  args: {
    // Email: { type: GraphQLEmail },
    Email: { type: GraphQLString },
    MobileNo: { type: GraphQLString },
  },
  async resolve(parent, args) {
    console.log("email or username", args.Email);
    let valid = emailValidator.validate(args.Email);
    console.log("valid", valid);

    var Result = [];
    var Result1 = [];
    if (
      typeof args.Email != "undefined" &&
      args.Email != "" &&
      args.Email != null
    ) {
      if (valid == true) {
        await Users.find(
          { Email: { $regex: new RegExp(`^${args.Email}$`, "i") }, Status: 1 },
          { _id: false, UniqueID: true, Email: true }
        ).then(async (isEmail) => {
          console.log("isEmailExists", isEmail);

          Result = await isEmail;
          Result = Result.concat(isEmail);
        });
      } else if (valid == false) {
        await Users.find(
          {
            UserName: { $regex: new RegExp(`^${args.Email}$`, "i") },
            Status: 1,
          },
          { _id: false, UniqueID: true, Email: true }
        ).then(async (isEmail) => {
          console.log("isUsernameExists", isEmail);

          Result = await isEmail;
          Result = Result.concat(isEmail);
        });
      }
    }

    if (
      typeof args.MobileNo != "undefined" &&
      args.MobileNo != "" &&
      args.MobileNo != null
    ) {
      await Users.find(
        { MobileNo: args.MobileNo, Status: 1 },
        { _id: false, UniqueID: true }
      ).then(async (isMobile) => {
        Result = Result.concat(isMobile);
      });
    }
    return await new Set(Result);
  },
};

// user singin
const SignInObject = {
  type: UserType,
  Description: "user sign in",
  args: {
    Email: { type: GraphQLEmail },
    Password: { type: GraphQLString },
    MobileNo: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    var UserData = [];
    var passwordHash = require("password-hash");
    if (
      typeof args.Email != "undefined" &&
      args.Email != "" &&
      args.Email != null
    ) {
      UserData = await Users.findOne({
        Email: args.Email,
        Status: 1,
        isVerified: 1,
      }).then((result) => {
        console.log(result, "resultresultresult");
        if (result != null) {
          if (passwordHash.verify(args.Password, result.Password))
            return result;
          else throw new Error("Password does not match");
        } else throw new Error("Email does not exists");
      });
    }
    if (
      typeof args.MobileNo != "undefined" &&
      args.MobileNo != "" &&
      args.MobileNo != null
    ) {
      UserData = await Users.findOne({
        MobileNo: args.MobileNo,
        Status: 1,
        isVerified: 1,
      }).then((result) => {
        if (result != null) {
          if (passwordHash.verify(args.Password, result.Password))
            return result;
          else throw new Error("Password does not match");
        } else throw new Error("Mobile No. does not exists");
      });
    }
    // data =
    console.log(UserData, "UserData");
    return UserData ? await generateToken(context, UserData) : [];
  },
};

// facebook signin
const FaceBookSignInObject = {
  type: UserType,
  Description: "facebook sign in",
  args: { Name: { type: GraphQLString }, Email: { type: GraphQLEmail } },
  async resolve(parent, args, context) {
    UserData = await Users.findOne({
      Name: args.Name,
      Email: args.Email,
      Status: 1,
    });
    return await generateToken(context, UserData);
  },
};

// google sign in
const GoogleSignInObject = {
  type: UserType,
  Description: "Google sign in",
  args: { Name: { type: GraphQLString }, Email: { type: GraphQLEmail } },
  async resolve(parent, args, context) {
    var UserData = [];
    UserData = await Users.findOne({
      Name: args.Name,
      Email: args.Email,
      Status: 1,
    }).then(async (result) => {
      if (result == null) {
        let SignUpConstant = new Users({
          Name: args.Name,
          Email: args.Email,
          Description: args.Name + "--" + args.Email,
          isVerified: true,
          SignUpMethod: "Google",
          Password: "",
        });
        return await SignUpConstant.save();
      }
      return result;
    });

    return await generateToken(context, UserData);
  },
};

// reset url in password is valid or not
const IsResetURLValid = {
  type: PasswordInfo,
  args: {
    UniqueLinkKey: { type: GraphQLString },
  },
  resolve(parent, args) {
    var Message = {};
    // console.log(args);
    return ForgotPasswordLogs.findOne({
      UniqueLinkKey: args.UniqueLinkKey,
      Status: ArticleStatusConst.Active,
      ExpiryDate: { $gte: Date.now() },
    }).then((Valid) => {
      if (Valid != null && Valid.ExpiryDate) Message["Message"] = true;
      else Message["Message"] = false;
      return Message;
    });
  },
};

// get user by id
const User = {
  type: new GraphQLList(UserType),
  args: { ID: { type: GraphQLID } },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    if (id.UserID) args.ID = id.UserID;
    return Users.find({ ID: args.ID });
  },
};

// get all users
const UserAll = {
  type: new GraphQLList(UserType),
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    return Users.find({ Status: 1 });
  },
};

// get user total balance
const GetTotalUserBalance = {
  type: UserType,
  args: { UserID: { type: GraphQLInt } },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
    if (id.UserID) args.UserID = id.UserID;
    return Users.findOne(
      { ID: args.UserID },
      { _id: false, TotalWalletAmount: true }
    );
  },
};

module.exports = {
  GetAuthorProfileDetails,
  GetTotalUserBalance,
  User,
  UserAll,
  LoginObject,
  GetUserProfile,
  SignInObject,
  FaceBookSignInObject,
  GoogleSignInObject,
  IsEmailExist,
  RewardsProgress,
  IsResetURLValid,
  GetUserByID,
};
