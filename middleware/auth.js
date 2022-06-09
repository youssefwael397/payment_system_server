const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_encrypt = process.env.JWT_ENCRYPT;

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers.authorization

    if (!token) {
        return res.status(403).send({ status: 'error', error: "A token is required for authentication" });
    }

    try {
        console.log(token)
        jwt.verify(token, jwt_encrypt);
    } catch (err) {
        return res.status(401).send({ status: 'error', error: "Invalid Token" });
    }
    return next();
};

module.exports = verifyToken;