const { categoryRepo } = require("../repos/categoryRepo");
const { branchRepo } = require("../repos/branchRepo");
const fs = require("fs");
const validateNumber = require("../utils/validateNumber");

// Create new category
const createNewCategory = async ({ category_name, branch_id }) => {
  try {
    if (!category_name || !branch_id) {
      const err = {
        code: 404,
        text: "All inputs are required.",
      };
      return { err };
    }

    const { err } = validateNumber(branch_id);
    if (err) return { err };

    const isExistBranch = await branchRepo.getBranchById(branch_id);
    if (!isExistBranch) {
      const err = {
        code: 404,
        text: `No branches with id : ${branch_id}`,
      };
      return { err };
    }

    const category_data = {
      category_name: category_name,
      branch_id: branch_id,
    };

    const category_exist = await categoryRepo.checkIfCategoryExists(
      category_data
    );
    if (category_exist) {
      const err = {
        code: 409,
        text: "هذا التصنيف موجود بالفعل",
      };
      return { err };
    }

    const new_category = await categoryRepo.createNewCategory(category_data);
    return { new_category };
  } catch (error) {
    console.log("categoryController createNewCategory error: " + error);
  }
};

// update category info
const updateCategory = async (category_id, category_name) => {
  try {
    if (!category_id || !category_name) {
      const err = {
        code: 404,
        text: "Please Insert All information what we need.",
      };
      return { err };
    }

    const { err } = validateNumber(category_id);
    if (err) return { err };

    const existCategory = await categoryRepo.getCategoryById(category_id);
    if (!existCategory) {
      const err = {
        code: 404,
        text: `No categories with id: ${category_id}`,
      };
      return { err };
    }

    const category = await categoryRepo.updateCategory(
      category_id,
      category_name
    );
    return { category };
  } catch (error) {
    console.log("categoryController updateCategory error: " + error);
  }
  return { category, err };
};

// get all categories
const getAllCategoriesByBranchId = async (id) => {
  try {
    const { err } = validateNumber(id);
    if (err) return { err };
    const isBranchExist = await branchRepo.getBranchById(id);
    if (!isBranchExist) {
      const err = {
        code: 400,
        text: `no branch with id: ${id}`,
      };
      return { err };
    }
    const categories = await categoryRepo.getAllCategoriesByBranchId(id);
    return { categories };
  } catch (err) {
    console.log("categoryController getAllCategoriesByBranchId error: " + err);
  }
};

// get category by id
const getCategoryById = async (id) => {
  try {
    const { err } = validateNumber(id);
    if (err) return { err };
    let category = await categoryRepo.getCategoryById(id);
    if (!category) {
      const err = {
        code: 404,
        text: `No categories with id: ${id}`,
      };
      return { err };
    }
    return { category };
  } catch (err) {
    console.log("categoryController getCategoryById error: " + err);
  }
};

// delete category by id
const deleteCategoryById = async (id) => {
  try {
    const { err } = validateNumber(id);
    if (err) return { err };

    let category = await categoryRepo.getCategoryById(id);
    if (!category) {
      const err = {
        code: 404,
        text: `No categories with id: ${id}`,
      };
      return { err };
    }
    await categoryRepo.deleteCategoryById(id);
    const result = `category "${category.category_name}" 's been deleted.`;
    return { result };
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
