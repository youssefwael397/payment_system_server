// imports
const { Category, Sequelize, sequelize } = require("../models/index");
const op = Sequelize.Op;

// Create new category
const createNewCategory = async (category) => {
  try {
    const new_category = await Category.create(category);
    return new_category;
  } catch (error) {
    console.log("categoryRepo createNewCategory error: " + error);
  }
};

// update category
const updateCategory = async (category_id, category_name) => {
  try {
    await Category.update(
      {
        category_name: category_name,
      },
      {
        where: { category_id, category_id },
      }
    );
    const update_category = await Category.findOne({
      where: { category_id, category_id },
    });
    return update_category;
  } catch (error) {
    console.log("categoryRepo updateCategory error: " + error);
  }
};

const getAllCategoriesByBranchId = async (id) => {
  try {
    const categories = await Category.findAll({ where: { branch_id: id } });
    return categories;
  } catch (error) {
    console.log("categoryRepo getAllCategoriesByBranchId error: " + error);
  }
};

// get category by id
const getCategoryById = async (id) => {
  try {
    const category = await Category.findOne({ where: { category_id: id } });
    return category;
  } catch (error) {
    console.log("categoryRepo getCategoryById error: " + error);
  }
};

// get category by name
const getCategoryByName = async (name) => {
  try {
    const category = await Category.findOne({ where: { category_name: name } });
    return category;
  } catch (error) {
    console.log("categoryRepo getCategoryByName error: " + error);
  }
};

// delete category by id
const deleteCategoryById = async (id) => {
  try {
    const category = await Category.destroy({
      where: { category_id: id },
      truncate: false,
    });
    console.log(category)
    if (category) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("categoryRepo deleteCategoryById error: " + error);
  }
};

const checkIfCategoryExists = async (category) => {
  const exist_category = await Category.findOne({
    where: {
      category_name: category.category_name,
      branch_id: category.branch_id,
    },
  });

  if (exist_category) {
    return true;
  } else {
    return false;
  }
};

// this object is responsible for exporting functions of this file to other files
const categoryRepo = {
  createNewCategory,
  getCategoryById,
  getCategoryByName,
  getAllCategoriesByBranchId,
  deleteCategoryById,
  checkIfCategoryExists,
  updateCategory,
};

module.exports = { categoryRepo };
