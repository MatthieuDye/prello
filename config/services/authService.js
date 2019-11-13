const jwt = require('jsonwebtoken');

let secret = 'secret';

const authService = () => {
  const issue = (payload, secretKey, expirationTime) => {
    if (secretKey !== '') {
      // For changing password and account verification
      // Signing with the users current password hash guarantees single-usage of every issued token.
      // This is because the password hash always changes after successful password-reset.
      // There is no way the same token can pass verification twice.
      // The signature check would always fail. The JWTs we issue become single-use tokens.
      secret = secretKey;
    }
    return jwt.sign(payload, secret, { expiresIn: expirationTime });
  };

  const verify = (token, secretKey, cb) => {
    if (secretKey !== '') {
      secret = secretKey;
    }
    return jwt.verify(token, secret, {}, cb);
  };

  return {
    issue,
    verify,
  };
};

module.exports = authService;