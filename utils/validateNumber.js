const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_encrypt = process.env.JWT_ENCRYPT;

const validateNumber = (num) => {
  const idPattern = /^\d*$/;
  const numberValid = idPattern.test(num);
  let err;
  if (!numberValid) {
    err = {
      code: 403,
      text: "Please Insert valid id",
    };
  }
  return { err };
};

module.exports = validateNumber;
