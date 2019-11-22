const jwt = require("jsonwebtoken");

exports.decodeToken = req => {

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
            .json({message: "No token in the request header"});
    }

    return jwt.verify(tokenToVerify, process.env.SECRET_TOKEN);


};
