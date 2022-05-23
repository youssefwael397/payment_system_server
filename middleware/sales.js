const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_encrypt = process.env.JWT_ENCRYPT;

const verifySales = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers.authorization
    const { is_sales } = jwt.decode(token, jwt_encrypt);
    if (!is_sales) {
        return res.status(401).send({ status: 'error', error: "Only Sales Have Permissions." });
    }
    return next();
};

module.exports = verifySales;