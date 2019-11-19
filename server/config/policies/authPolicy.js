// JWT token checks
const JWTService = require("../services/authService");
const jwt = require("jsonwebtoken");

// Following should be found in the request header:
// "Authorization: Bearer [token]" or "token: [token]"
module.exports = (req, res, next) => {
  let tokenToVerify;
  if (req.header("Authorization")) {
    const parts = req.header("Authorization").split(" ");

    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/.test(scheme)) {
        tokenToVerify = credentials;
      } else {
        return res.status(401).json({
          message:
            "Request header format: Authorization: Bearer [token]"
        });
      }
    } else {
      return res.status(401).json({
        message:
          "Request header format: Authorization: Bearer [token]"
      });
    }
  } else if (req.body.token) {
    tokenToVerify = req.body.token;
    delete req.query.token;
  } else {
    return res
      .status(401)
      .json({ message: "No token in the request header" });
  }

  let payload;

  try {
    payload = jwt.verify(tokenToVerify, process.env.SECRET_TOKEN);
    if (!payload) {
      // On verifie la validité du payload avec notre secretKey
      return res.status(401).json({ message: "Unauthorized request"});
    }
    next(); // Passe à la fonction suivante
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid Token"});
    }

    next();
  }
};