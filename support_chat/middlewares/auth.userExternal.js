const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const authUserExternal = async (req, res, next) => {
  try {
  const authHeader = req.header("Authorization")?.split(" ");

  if (authHeader?.length !== 2) {
    return res.status(403).json({
      message: "This route is protected and you can't have access to it !!",
    });
  }

  const token = authHeader[1];

  
    const jwtToken = jwt.verify(token, process.env.JWT_SECRET);

    const userExternal = await userModel.findOne({_id : jwtToken._id}).lean();        
    
    if (userExternal == null) {
      return res.status(401).json({ message: 'token not correct' });
    }
    Reflect.deleteProperty(userExternal, "password");

    req.userExternal = userExternal;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'token is expire' });
  }
  console.log(error);
  return res.status(500).json({ message: 'خطای داخلی سرور' });
  }  
};


module.exports ={
  authUserExternal
}
