const { branchRepo } = require("../../repos/branchRepo");

const validateUpdateBranch = async (id, branch) => {
  const { branch_name, branch_address } = branch;
 
  if (!(id && branch_name && branch_address)) {
    const err = {
      code: 403,
      text: "All inputs are required.",
    };
    return { err };
  }

  const idPattern = /^\d*$/;
  const numberValid = idPattern.test(id);
  

  if (!numberValid) {
    const err = {
      code: 403,
      text: "Please insert a valid id",
    };
    return { err };
  }

  const ExistBranch = await branchRepo.getBranchById(id);
  if (!ExistBranch) {
    const err = {
      code: 409,
      text: `No Branch with id: ${id}`,
    };
    return { err };
  }

  const branch_data = {
    branch_id: id,
    branch_name: branch_name,
    branch_address: branch_address,
  };
  return { branch_data };
};
module.exports = validateUpdateBranch;
