const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_encrypt = process.env.JWT_ENCRYPT;

const isBoss = (token) => {
    const is_verify = jwt.verify(token, jwt_encrypt);
    if (!is_verify) {
        return false
    } else {
        const decoded_token = jwt.decode(token);
        const is_boss = decoded_token.is_boss;
        return is_boss
    }

}

const tokenValidate = {
    isBoss
}

module.exports = { tokenValidate }
