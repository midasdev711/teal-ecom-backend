
const jwt = require( 'jsonwebtoken' ),
      { TOKEN_SECRET_KEY } = require("../constant");
var   fs = require("fs");

const generateToken = async (context, UserData ) => {
  var data = {};
  try {
    var privateKey = fs.readFileSync("./news/schema/middleware/new.key");
    data = UserData;
    data["token"] = jwt.sign({ userId: UserData.ID }, privateKey, { algorithm: 'RS256', expiresIn: "30000ms" })
    data["refreshToken"] = jwt.sign({ userId: UserData.ID }, privateKey, { algorithm: 'RS256', expiresIn: "24h" })
    return await data;
  } catch (e) {
    throw new Error ( 'Authentication token is invalid, please log in', e)
  }
};

const verifyToken = async (context ) => {
  try {
    const Authorization = context.headers.authorization
    console.log(Authorization,"Authorization working");
    var data = {};
    if( Authorization ) {
      console.log("herytytytyty");
      var publicKey = fs.readFileSync("./news/schema/middleware/new.pem");
      const token = Authorization.replace('Bearer ', '')
      const { userId } = jwt.verify(token, publicKey, { algorithm: 'RS256' , expiresIn: "30000ms"  })
      // console.log(userId,"userIduserIduserIduserIduserIduserIduserIduserIduserIduserId");
      data["UserID"] = userId
      return data
    }
  } catch (e) {
      throw new Error( 'Authentication token is invalid, please log in')
  }
};

  const regenerateToken = async( context, refresh ) => {
    var data = {};
    try {
        var privateKey = fs.readFileSync("./news/schema/middleware/new.key");
        data["token"] = jwt.sign({ userId: context.UserID }, privateKey, { algorithm: 'RS256', expiresIn: "30000ms" })
        data["refreshToken"] = refresh.refreshToken
        return await data;
    } catch (e) {
      throw new Error ( 'Issue in regenerate token is invalid, please log in', e)
    }
  };


module.exports = { generateToken, verifyToken,regenerateToken };
