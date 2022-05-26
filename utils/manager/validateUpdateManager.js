const { managerRepo } = require("../../repos/managerRepo");
const { branchRepo } = require("../../repos/branchRepo");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const validateUpdateManager = async (id, manager) => {

  const {
    manager_name,
    email,
    national_id,
    phone,
    facebook_link,
  } = manager;

  if (!id || !manager_name || !email || !national_id || !phone || !facebook_link) {
    const err = {
      code: 403,
      text: "All inputs are required.",
    };
    return {err}
  }

  
  const idPattern = /^\d*$/;
  const numberValid = idPattern.test(id);

  if (!numberValid) {
    const err = {
      code: 403,
      text: "Please Insert valid branch id",
    };
    return { err };
  }


  const ExistManager = await managerRepo.getManagerById(id);
  if (!ExistManager) {
    const err = {
      code: 409,
      text: `No Manager with id : ${id}`,
    };
    return { err };
  }

  const manager_data = {
    manager_id: id,
    manager_name,
    email,
    national_id,
    phone,
    facebook_link,
  };
  return { manager_data };
};

module.exports = validateUpdateManager;
