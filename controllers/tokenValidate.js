const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_encrypt = process.env.JWT_ENCRYPT;

// check if verify or not
const isVerify = (token) => {
    const isVerified = jwt.verify(token, jwt_encrypt);
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

//  check if manager or not 
const isManager = (token) => {
    const decodedToken = jwt.decode(token, jwt_encrypt);
    return decodedToken.is_manager;
}

const tokenValidate = {
    isVerify,
    isBoss,
    isManager
}

module.exports = { tokenValidate }
