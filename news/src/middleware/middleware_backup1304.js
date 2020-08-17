
const jwt = require( 'jsonwebtoken' ),
      { TOKEN_SECRET_KEY } = require("../constant");


const loggingMiddleware = async (req) => {
  console.log('ip:', req.ip);
  const token = req.headers.authorization;
  console.log(token,"tokentokentokentoken");
  // console.log(req.body,"reqreqreqreqreq");
  // next();
}


const generateToken = async (context, UserData ) => {
  var data = {};
  try {
    data = UserData;
    data["token"] = jwt.sign({ userId: UserData.ID }, TOKEN_SECRET_KEY)
    return await data;
  } catch (e) {
    throw new Error( 'Authentication token is invalid, please log in')
  }
};

const verifyToken = async (context ) => {
  try {
    const Authorization = context.headers.authorization
    console.log(Authorization,"Authorization working");
    var data = {};
    if( Authorization ) {
      const token = Authorization.replace('Bearer ', '')
      const { userId } = jwt.verify(token, TOKEN_SECRET_KEY)
      data["UserID"] = userId
      return data
    }
  } catch (e) {
      throw new Error( 'Authentication token is invalid, please log in')
  }
};

module.exports = { loggingMiddleware , generateToken, verifyToken };
