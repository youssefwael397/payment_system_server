const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_encrypt = process.env.JWT_ENCRYPT;


const validateTokenError = (token) => {
    let err;
    if (!token) {
        err = {
            code: 401,
            text: "please attach token."
        }
    } else {
        const isVerified = jwt.verify(token, jwt_encrypt);
        if (!isVerified) {
            err = {
                code: 401,
                text: "invalid token."
            }
        }
    }
    return err;
}

// check if verify or not
const isVerify = (token) => {
    const isVerified = jwt.verify(token, jwt_encrypt);
    if (isVerified) {
        return true
    } else {
        return false
    }
}


const salesAuthError = (token) => {
    let err;
    const decodedToken = jwt.decode(token, jwt_encrypt);
    !decodedToken.is_sales ?
        err = {
            code: 401,
            text: "Only Sales Have Permissions."
        } : null

    return err
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

//  check if sales or not 
const isSales = (token) => {
    const decodedToken = jwt.decode(token, jwt_encrypt);
    return decodedToken.is_sales;
}

const tokenValidate = {
    isVerify,
    isBoss,
    isManager,
    isSales,
    validateTokenError,
    salesAuthError
}

module.exports = { tokenValidate }
