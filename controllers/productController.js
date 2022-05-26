const { productRepo } = require("../repos/productRepo");
const { branchRepo } = require("../repos/branchRepo");
const { categoryRepo } = require("../repos/categoryRepo");
const validateNumber = require("../utils/validateNumber");
const fs = require("fs");

// Create new Product
const createNewProduct = async (product) => {
  try {
    const { category_id, branch_id, product_name, product_price, count } =
      product;
    if (
      !category_id ||
      !branch_id ||
      !product_name ||
      !product_price ||
      !count
    ) {
      const err = {
        code: 404,
        text: "All inputs are required",
      };
      return { err };
    }

    const validateCategoryId = validateNumber(category_id);
    if (validateCategoryId.err) {
      const err = {
        code: 403,
        text: "Please Insert valid category id",
      };
      return { err };
    }

    const categoryExist = await categoryRepo.getCategoryById(category_id);
    if (!categoryExist) {
      const err = {
        code: 404,
        text: `No category with id : ${category_id}`,
      };
      return { err };
    }

    const validateBranchId = validateNumber(branch_id);
    if (validateBranchId.err) {
      const err = {
        code: 403,
        text: "Please Insert valid branch id",
      };
      return { err };
    }

    const validateCount = validateNumber(count);
    if (validateCount.err) {
      const err = {
        code: 403,
        text: "Please Insert valid count",
      };
      return { err };
    }

    const validatePrice = validateNumber(product_price);
    if (validatePrice.err) {
      const err = {
        code: 403,
        text: "Please Insert valid price",
      };
      return { err };
    }

    const isExistBranch = await branchRepo.getBranchById(branch_id);
    if (!isExistBranch) {
      const err = {
        code: 404,
        text: `No branches with id : ${branch_id}`,
      };
      return { err };
    }

    const duplicateProduct = await productRepo.checkIfProductExists(product);
    if (duplicateProduct) {
      const err = {
        code: 409,
        text: "This Product is already exist.",
      };
      return { err };
    }
    const new_Product = await productRepo.createNewProduct(product);
    return { new_Product };
  } catch (error) {
    console.log("ProductController createNewProduct error: " + error);
  }
  return { new_Product, err };
};

// update Product info
const updateProduct = async (product_id, product) => {
  try {
    const { product_name, product_price, count } = product;
    if (!product_id || !product_name || !product_price || !count) {
      const err = {
        code: 404,
        text: "Please Insert All information what we need.",
      };
      return { err };
    }

    const validateCount = validateNumber(count);
    if (validateCount.err) {
      const err = {
        code: 403,
        text: "Please Insert valid count",
      };
      return { err };
    }

    const validatePrice = validateNumber(product_price);
    if (validatePrice.err) {
      const err = {
        code: 403,
        text: "Please Insert valid price",
      };
      return { err };
    }

    const existProduct = await productRepo.getProductById(product_id);
    if (!existProduct) {
      const err = {
        code: 404,
        text: `No products with id: ${product_id}`,
      };
      return { err };
    }

    const updateProduct = await productRepo.updateProduct(product_id, product);
    return { updateProduct };
  } catch (error) {
    console.log("ProductController updateProduct error: " + error);
  }
};

// get all products
const getAllProductsByBranchId = async (id) => {
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
    const products = await productRepo.getAllProductsByBranchId(id);
    return { products };
  } catch (err) {
    console.log("ProductController getAllProductsByBranchId error: " + err);
  }
};

// get Product by id
const getProductById = async (id) => {
  try {
    const { err } = validateNumber(id);
    if (err) return { err };
    const product = await productRepo.getProductById(id);
    if (!product) {
      const err = {
        code: 404,
        text: `No products with id: ${id}`,
      };
      return { err };
    }
    return { product };
  } catch (err) {
    console.log("ProductController getProductById error: " + err);
  }
};

// delete Product by id
const deleteProductById = async (id) => {
  try {
    const { err } = validateNumber(id);
    if (err) return { err };

    const product = await productRepo.getProductById(id);
    if (!product) {
      const err = {
        code: 404,
        text: `No products with id: ${id}`,
      };
      return { err };
    }

    await productRepo.deleteProductById(id);
    const result = `Product "${product.product_name}" 's been deleted.`;

    return { result };
  } catch (err) {
    console.log("ProductController deleteProductById error: " + err);
  }
};

// this object is responsible for exporting functions of this file to other files
const productController = {
  createNewProduct,
  getAllProductsByBranchId,
  getProductById,
  deleteProductById,
  updateProduct,
};

module.exports = { productController };
