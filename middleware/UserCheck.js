const jwt = require("jsonwebtoken");

const userTokenCheck = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(403).send({ message: "User not logged in" });
  }
  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    if (!user) {
      return res.status(403).send({ message: "Session expired Log in again" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(403).send({ message: "Invalid Session" });
  }
};

module.exports = userTokenCheck;
