const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_encrypt = process.env.JWT_ENCRYPT;

const verifyBoss = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers.authorization
    const { is_boss } = jwt.decode(token, jwt_encrypt);
    if (!is_boss) {
        return res.status(401).send({ status: 'error', error: "Only Boss Have Permissions." });
    }
    return next();
};

module.exports = verifyBoss;