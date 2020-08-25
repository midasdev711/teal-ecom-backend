const jwt = require("jsonwebtoken"),
  { TOKEN_SECRET_KEY } = require("../constant");
var fs = require("fs");

const generateToken = async (UserData) => {
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

module.exports = {
  generateToken,
  verifyToken,
  regenerateToken,
  regenerateCreativeToken,
};
