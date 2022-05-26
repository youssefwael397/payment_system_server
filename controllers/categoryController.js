const { categoryRepo } = require("../repos/categoryRepo");
const { branchRepo } = require("../repos/branchRepo");
const fs = require("fs");

// Create new category
const createNewCategory = async ({ category_name, branch_id }, token) => {
  let err, new_category;
  if (!category_name || !branch_id) {
    err = {
      code: 404,
      text: "Please Insert category name.",
    };
  } else {
    try {
      const isExistBranch = await branchRepo.getBranchById(branch_id);
      if (!isExistBranch) {
        err = {
          code: 404,
          text: `No branches with id : ${branch_id}`,
        };
      } else {
        const category = {
          category_name: category_name,
          branch_id: branch_id,
        };
        const duplicateCategory = await duplicateCategoryInfo(category);
        if (duplicateCategory) {
          err = {
            code: 409,
            text: "Duplicate information. Please Change It.",
          };
        } else {
          new_category = await categoryRepo.createNewCategory(category);
        }
      }
    } catch (error) {
      console.log("categoryController createNewCategory error: " + error);
    }
  }
  return { new_category, err };
};

// update category info
const updateCategory = async (category_id, category_name, token) => {
  let err, category;
  if (!token) {
    err = {
      code: 401,
      text: "Invalid token",
    };
  } else {
    const isValid = tokenValidate.isVerify(token);
    if (!isValid) {
      err = {
        code: 401,
        text: "Invalid token",
      };
    } else {
      const isManager = tokenValidate.isManager(token);
      if (!isManager) {
        err = {
          code: 403,
          text: "You have no permissions to update categories.",
        };
      } else {
        if (!category_id || !category_name) {
          err = {
            code: 404,
            text: "Please Insert All information what we need.",
          };
        } else {
          try {
            const existCategory = await categoryRepo.getCategoryById(
              category_id
            );
            if (!existCategory) {
              err = {
                code: 404,
                text: `No categories with id: ${category_id}`,
              };
            } else {
              const updateCategory = await categoryRepo.updateCategory(
                category_id,
                category_name
              );
              category = updateCategory;
            }
          } catch (error) {
            console.log("categoryController updateCategory error: " + error);
          }
        }
      }
    }
  }
  return { category, err };
};

// check if duplicate category info or not
const duplicateCategoryInfo = async (category) => {
  const isExists = await categoryRepo.checkIfCategoryExists(category);
  return isExists;
};

// get all categories
const getAllCategoriesByBranchId = async (id) => {
  try {
    let err, categories;
    const isBranchExist = await branchRepo.getBranchById(id);
    if (!isBranchExist) {
      err = {
        code: 400,
        text: `no branch with id: ${id}`,
      };
    } else {
      categories = await categoryRepo.getAllCategoriesByBranchId(id);
    }
    return { categories, err };
  } catch (err) {
    console.log("categoryController getAllCategoriesByBranchId error: " + err);
  }
};

// get category by id
const getCategoryById = async (id) => {
  let err;
  try {
    let category = await categoryRepo.getCategoryById(id);
    if (!category) {
      err = {
        code: 404,
        text: `No categories with id: ${id}`,
      };
    }
    return { category, err };
  } catch (err) {
    console.log("categoryController getCategoryById error: " + err);
  }
};

// delete category by id
const deleteCategoryById = async (id, token) => {
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
        const isManager = tokenValidate.isManager(token);
        if (!isManager) {
          err = {
            code: 403,
            text: "You have no permissions to delete categories.",
          };
        } else {
          let category = await categoryRepo.getCategoryById(id);
          if (!category) {
            err = {
              code: 404,
              text: `No categories with id: ${id}`,
            };
          } else {
            await categoryRepo.deleteCategoryById(id);
            result = `category "${category.category_name}" 's been deleted.`;
          }
        }
      }
    }
    return { result, err };
  } catch (err) {
    console.log("categoryController deleteCategoryById error: " + err);
  }
};

// this object is responsible for exporting functions of this file to other files
const categoryController = {
  createNewCategory,
  getAllCategoriesByBranchId,
  getCategoryById,
  deleteCategoryById,
  updateCategory,
};

module.exports = { categoryController };
