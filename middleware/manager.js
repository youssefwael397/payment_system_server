const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_encrypt = process.env.JWT_ENCRYPT;

const verifyManager = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers.authorization
    const { is_manager } = jwt.decode(token, jwt_encrypt);
    if (!is_manager) {
        return res.status(401).send({ status: 'error', error: "Only Manager Have Permissions." });
    }
    return next();
};

module.exports = verifyManager;