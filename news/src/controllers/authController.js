const jwt = require("jsonwebtoken");
var fs = require("fs");
const apiKeys = require("../models/api_key");

const generateToken = async (context, UserData) => {
  var data = {};
  try {
    var privateKey = fs.readFileSync("./news/schema/middleware/new.key");
    data = UserData;
    data["token"] = jwt.sign({ userId: UserData.ID }, privateKey, {
      algorithm: "RS256",
      expiresIn: "30d",
    });
    data["refreshToken"] = jwt.sign({ userId: UserData.ID }, privateKey, {
      algorithm: "RS256",
      expiresIn: "150d",
    });
    return await data;
  } catch (e) {
    throw new Error("Authentication token is invalid, please log in", e);
  }
};

const verifyToken = async (context) => {
  console.log("this is context", context.headers.authorization);

  try {
    const Authorization = context.headers.authorization;
    var data = {};
    if (Authorization) {
      var publicKey = fs.readFileSync("./news/schema/middleware/new.pem");
      const token = Authorization.replace("Bearer ", "");
      const { userId } = jwt.verify(token, publicKey, {
        algorithm: "RS256",
        expiresIn: "30d",
      });
      data["UserID"] = userId;
      return data;
    } else {
      throw new Error("No Token Provided");
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

const regenerateToken = async (context, refresh) => {
  var data = {};
  try {
    var privateKey = fs.readFileSync("./news/schema/middleware/new.key");
    data["token"] = jwt.sign({ userId: context.UserID }, privateKey, {
      algorithm: "RS256",
      expiresIn: "30d",
    });
    data["refreshToken"] = refresh.refreshToken;
    return await data;
  } catch (e) {
    throw new Error("Issue in regenerate token is invalid, please log in", e);
  }
};

const regenerateCreativeToken = async (context, refresh) => {
  var data = {};
  try {
    var privateKey = fs.readFileSync("./news/schema/middleware/creative.key");
    data["CreativeToken"] = jwt.sign({ userId: context.UserID }, privateKey, {
      algorithm: "RS256",
      expiresIn: "30d",
    });
    // data["CreativeToken"] = refresh.refreshToken
    return await data;
  } catch (e) {
    throw new Error("Issue in generating creative token", e);
  }
};

const authenticateRequest = async (args, context) => {
  console.log(context.headers);
  const host = context.headers.host;
  if (
    host != "teal.com" ||
    host != "localhost:9200" ||
    host != "api.teal.com"
  ) {
    if (context.headers.APIKey) {
      let data = await apiKeys.findOne({
        APIKey: context.headers.APIKey,
        isExpired: false,
      });
      if (data) args.UserAuthenticate = true;
      else args.UserAuthenticate = false;
    }
    res.send("API is up!");
  } else {
    args.UserAuthenticate = true;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  regenerateToken,
  regenerateCreativeToken,
  authenticateRequest,
};
