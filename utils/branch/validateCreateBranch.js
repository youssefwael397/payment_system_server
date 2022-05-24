const { branchRepo } = require("../../repos/branchRepo");
const bcrypt = require("bcryptjs");
const fs = require("fs");


const validateCreateBranch = async (branch, logo) => {
  const { branch_name, branch_address } = branch;
  if (!logo) {
    const err = {
      code: 403,
      text: "Please attach logo image",
    };
    return { err };
  }

  if (!(branch_name && branch_address)) {
    const err = {
      code: 403,
      text: "All inputs are required.",
    };
    fs.unlinkSync(logo.path);
    return { err };
  }

  const ExistBranch = await branchRepo.checkIfBranchExists(branch);
  if (ExistBranch) {
    const err = {
      code: 409,
      text: "This Branch is already exist.",
    };
    fs.unlinkSync(logo.path);
    return { err };
  }

  const new_branch = {
    branch_name: branch_name,
    branch_address: branch_address,
    logo: logo.filename,
  };
  return { new_branch };
};
module.exports = validateCreateBranch;
