const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.query.token || req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  //no callback, no promise, how to check for failrue?

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ message: "Invalid token" });
  }
};
