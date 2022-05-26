const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_encrypt = process.env.JWT_ENCRYPT;

const validateId = (req, res, next) => {
  const id =
    req.params.id ||
    req.body.branch_id ||
    req.body.manager_id ||
    req.body.category_id ||
    req.body.product_id ||
    req.body.branch_id ||
    req.body.sales_id ||
    req.body.client_id;

    console.log(id)

  const idPattern = /^\d*$/;
  const numberValid = idPattern.test(id);

  if (!numberValid) {
    return res
      .status(403)
      .send({ status: "error", error: "Please Insert valid id" });
  }

  return next();
};

module.exports = validateId;
