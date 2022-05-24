const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_encrypt = process.env.JWT_ENCRYPT;

const validateId = (req, res, next) => {
    const {id} = req.params;

    const idPattern = /^\d*$/;
    const numberValid = idPattern.test(id);
  
    if (!numberValid) {
        return res.status(403).send({ status: 'error', error: "Please Insert valid id" });
    }
    
    return next();
};

module.exports = validateId;