const { branchRepo } = require("../../repos/branchRepo");
const fs = require('fs')

const validateUpdateBranchLogo = async (id, logo) => {

  if (!logo) {
    const err = {
      code: 403,
      text: "Please Attach logo.",
    };
    return { err };
  }
  
  if (!id) {
    const err = {
      code: 403,
      text: "All inputs are required.",
    };
    fs.unlinkSync(logo.path)
    return { err };
    
  }

  const exist_branch = await branchRepo.getBranchById(id);
  if (!exist_branch) {
    const err = {
      code: 409,
      text: `No Branch with id: ${id}`,
    };
    fs.unlinkSync(logo.path);
    return { err };
  }

  fs.unlinkSync(`img/${exist_branch.logo}`);
  const branch_data = {
    branch_id: id,
    logo: logo.filename,
  };
  return { branch_data };
};
module.exports = validateUpdateBranchLogo;
