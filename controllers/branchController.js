const { branchRepo } = require("../repos/branchRepo");
const validateUpdateBranch = require("../utils/branch/validateUpdateBranch");
const validateUpdateBoss = require("../utils/boss/validateUpdateBoss");
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
    return {update_branch};
  } catch (error) {
    console.log("branchController updateBranch error: " + error);
  }
};

// check if duplicate branch info or not
const duplicateBranchInfo = async (branch) => {
  const isExists = await branchRepo.checkIfBranchExists(branch);
  return isExists;
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
  let err;
  try {
    let branch = await branchRepo.getBranchById(id);
    if (!branch) {
      err = {
        code: 404,
        text: `No Branches with id: ${id}`,
      };
    } else {
      const img = await fsAsync.readFile(`img/${branch.logo}`, {
        encoding: "base64",
      });
      branch.logo = img;
    }
    return { branch, err };
  } catch (err) {
    console.log("branchController getBranchById error: " + err);
  }
};

// update branch logo image
const updateLogoImage = async (id, logoImg, token) => {
  try {
    let success, err;
    if (!token) {
      err = {
        code: 401,
        text: "please attach token.",
      };
    } else {
      const isVerify = tokenValidate.isVerify(token);
      if (!isVerify) {
        err = {
          code: 401,
          text: "Invalid token",
        };
      } else {
        const isBoss = tokenValidate.isBoss(token);
        if (!isBoss) {
          err = {
            code: 403,
            text: "You have no permissions to update logo image.",
          };
        } else {
          if (!logoImg) {
            err = {
              code: 404,
              text: "Please Attach logo image.",
            };
          } else {
            const existBranch = await branchRepo.getBranchById(id);
            if (!existBranch) {
              err = {
                code: 404,
                text: `No Branches with id: ${id}`,
              };
              fs.unlinkSync(`img/${logoImg.filename}`);
            } else {
              const updateBranch = await branchRepo.updateLogoImage(
                id,
                logoImg.filename
              );
              if (updateBranch) {
                fs.unlinkSync(`img/${existBranch.logo}`);
                success = `logo image updated successfully`;
              }
            }
          }
        }
      }
    }
    return { success, err };
  } catch (error) {
    console.log("branchController updateLogoImage error: " + err);
  }
};

// delete branch by id
const deleteBranchById = async (id, token) => {
  try {
    let err, result;
    if (!token) {
      err = {
        code: 401,
        text: "please attach token.",
      };
    } else {
      const isVerify = tokenValidate.isVerify(token);
      if (!isVerify) {
        err = {
          code: 401,
          text: "Invalid token",
        };
      } else {
        const isBoss = tokenValidate.isBoss(token);
        if (!isBoss) {
          err = {
            code: 403,
            text: "You have no permissions to delete branches.",
          };
        } else {
          let branch = await branchRepo.getBranchById(id);
          if (!branch) {
            err = {
              code: 404,
              text: `No Branches with id: ${id}`,
            };
          } else {
            const previous_logo = fs.readFile(`img/${branch.logo}`);
            if (previous_logo) {
              fs.unlinkSync(`img/${branch.logo}`);
            }
            await branchRepo.deleteBranchById(id);
            result = `Branch "${branch.branch_name}" 's been deleted.`;
          }
        }
      }
    }
    return { result, err };
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
