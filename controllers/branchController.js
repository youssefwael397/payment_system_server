const { branchRepo } = require("../repos/branchRepo");
const validateCreateBranch = require("../utils/branch/validateCreateBranch");
const validateUpdateBranch = require("../utils/branch/validateUpdateBranch");
const validateUpdateBranchLogo = require("../utils/branch/validateUpdateBranchLogo");
const fs = require("fs");
const fsAsync = require("fs").promises;

// Create new branch
const createNewBranch = async (branch, logo) => {
  try {
    const { new_branch, err } = await validateCreateBranch(branch, logo);
    if (err) return { err };
    const create_branch = await branchRepo.createNewBranch(new_branch);
    return { create_branch };
  } catch (error) {
    console.log("branchController createNewBranch error: " + error);
  }
};

// update branch info
const updateBranch = async (id, branch) => {
  try {
    const { branch_data, err } = await validateUpdateBranch(id, branch);
    if (err) return { err };
    const update_branch = await branchRepo.updateBranch(branch_data);
    return { update_branch };
  } catch (error) {
    console.log("branchController updateBranch error: " + error);
  }
};

// update branch logo image
const updateLogoImage = async (id, logo) => {
  try {
    const { branch_data, err } = await validateUpdateBranchLogo(id, logo);
    if (err) return { err };

    const updateBranch = await branchRepo.updateLogoImage(branch_data);
    if (updateBranch) {
      const success = `logo image updated successfully`;
      return { success };
    }
  } catch (error) {
    console.log("branchController updateLogoImage error: " + error);
  }
};

// get all branches
const getAllBranches = async () => {
  try {
    const branches = await branchRepo.getAllBranches();
    let promises = [];
    branches.forEach((branch) => {
      promises.push(
        new Promise(async (resolve, reject) => {
          const img = await fsAsync.readFile(`img/${branch.logo}`, {
            encoding: "base64",
          });
          branch.logo = img;
          resolve();
        })
      );
    });
    await Promise.all(promises);
    return branches;
  } catch (err) {
    console.log("branchController getAllBranches error: " + err);
  }
};

// get branch by id
const getBranchById = async (id) => {
  try {
    let branch = await branchRepo.getBranchById(id);
    if (!branch) {
      const err = {
        code: 404,
        text: `No Branches with id: ${id}`,
      };
      return { err };
    }

    const img = await fsAsync.readFile(`img/${branch.logo}`, {
      encoding: "base64",
    });
    branch.logo = img;

    return { branch };
  } catch (err) {
    console.log("branchController getBranchById error: " + err);
  }
};

// delete branch by id
const deleteBranchById = async (id) => {
  try {
    const branch = await branchRepo.getBranchById(id);
    if (!branch) {
      const err = {
        code: 404,
        text: `No Branches with id: ${id}`,
      };
      return { err };
    }

    await branchRepo.deleteBranchById(id);
    fs.unlinkSync(`img/${branch.logo}`);
    const result = `Branch "${branch.branch_name}" 's been deleted.`;
    return { result };
  } catch (err) {
    console.log("branchController deleteBranchById error: " + err);
  }
};

// this object is responsible for exporting functions of this file to other files
const branchController = {
  createNewBranch,
  getAllBranches,
  getBranchById,
  deleteBranchById,
  updateBranch,
  updateLogoImage,
};

module.exports = { branchController };