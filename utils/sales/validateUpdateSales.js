const { salesRepo } = require("../../repos/salesRepo");
const validateNumber = require("../validateNumber");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const validateCreateBranch = async (id, sales) => {
  const { sales_name, email, facebook_link, national_id, phone } = sales;

  if (
    !id ||
    !sales_name ||
    !email ||
    !national_id ||
    !phone ||
    !facebook_link
  ) {
    const err = {
      code: 404,
      text: "All inputs are required.",
    };
    return { err };
  }

  const validateId = validateNumber(id);
  if (validateId.err) {
    const err = validateId.err;
    return { err };
  }

  const existSales = await salesRepo.getSalesById(id);
  if (!existSales) {
    const err = {
      code: 404,
      text: `No sales with id: ${id}`,
    };
    return {err}
  }

  const sales_data = {
    sales_id:id,
    sales_name: sales_name,
    email: email,
    national_id: national_id,
    phone: phone,
    facebook_link: facebook_link,
  };
  return { sales_data };
};
module.exports = validateCreateBranch;
