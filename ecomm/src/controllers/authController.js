const jwt = require("jsonwebtoken");
var fs = require("fs");
// const apiKeys = require("../models/api_key");

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
  // console.log("this is context", context.headers.authorization);

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

const authenticateRequest = async (req) => {
  const host = req.headers.origin;
  const { headers } = req;
  let userAuthenticate = false;
  if (host != "http://localhost:9200") {
    if (req.headers.apikey) {
      let data = await apiKeys.findOne({
        apiKey: req.headers.apiKey,
        isExpired: false,
      });
      if (data) userAuthenticate = true;
      else userAuthenticate = false;
      return { userAuthenticate, apiKey: req.headers.apiKey, headers };
    }
    return { userAuthenticate, headers };
  } else {
    userAuthenticate = true;
    let obj = { userAuthenticate, apiKey: "", headers };
    if (req.headers.apiKey) obj.apiKey = req.headers.apiKey;
    return obj;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  regenerateToken,
  regenerateCreativeToken,
  authenticateRequest,
};
