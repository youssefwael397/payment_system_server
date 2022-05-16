const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_encrypt = process.env.JWT_ENCRYPT;

// check if verify or not
const isVerify = (token) => {
    const isVerified = jwt.verify(token, jwt_encrypt);
    console.log("isVerify dunc==")
    if (isVerified) {
        return true
    } else {
        return false
    }
}

//  check if boss or not 
const isBoss = (token) => {
    const decodedToken = jwt.decode(token, jwt_encrypt);
    return decodedToken.is_boss;
}

const tokenValidate = {
    isVerify,
    isBoss
}

module.exports = { tokenValidate }
