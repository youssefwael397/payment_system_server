const { productRepo } = require('../repos/productRepo')
const { branchRepo } = require('../repos/branchRepo')
const { categoryRepo } = require('../repos/categoryRepo')
const { tokenValidate } = require('./tokenValidate')
const fs = require('fs');

// Create new Product
const createNewProduct = async (category_id, branch_id, product_name, product_price, count, token) => {
    let err, new_Product;
    if (!token) {
        err = {
            code: 401,
            text: "Invalid token"
        }
    } else {
        const isVerify = tokenValidate.isVerify(token);
        if (!isVerify) {
            err = {
                code: 401,
                text: "Invalid token"
            }
        } else {
            const isManager = tokenValidate.isManager(token);
            if (!isManager) {
                err = {
                    code: 403,
                    text: "You have no permissions to create products."
                }
            } else {
                if (!category_id || !branch_id || !product_name || !product_price || !count) {
                    err = {
                        code: 404,
                        text: "Please Insert All information we need to add product."
                    }
                } else {
                    try {
                        const isExistBranch = await branchRepo.getBranchById(branch_id)
                        if (!isExistBranch) {
                            err = {
                                code: 404,
                                text: `No branches with id : ${branch_id}`
                            }
                        } else {
                            const categoryExist = await categoryRepo.getCategoryById(category_id)
                            if (!categoryExist) {
                                err = {
                                    code: 404,
                                    text: `No category with id : ${category_id}`
                                }
                            } else {
                                const Product = {
                                    product_name: product_name,
                                    product_price: product_price,
                                    count: count,
                                    branch_id: branch_id,
                                    category_id: category_id
                                }
                                const duplicateProduct = await duplicateProductInfo(Product);
                                if (duplicateProduct) {
                                    err = {
                                        code: 409,
                                        text: "Duplicate information. Please Change It."
                                    }
                                } else {
                                    new_Product = await productRepo.createNewProduct(Product);
                                }
                            }
                        }

                    } catch (error) {
                        console.log("ProductController createNewProduct error: " + error)
                    }

                }
            }
        }
    }
    return { new_Product, err }
}


// update Product info
const updateProduct = async (product_id, product_name, product_price, count, token) => {
    let err, Product;
    if (!token) {
        err = {
            code: 401,
            text: "Invalid token"
        }
    } else {
        const isValid = tokenValidate.isVerify(token);
        if (!isValid) {
            err = {
                code: 401,
                text: "Invalid token"
            }
        } else {
            const isManager = tokenValidate.isManager(token);
            if (!isManager) {
                err = {
                    code: 403,
                    text: "You have no permissions to update products."
                }
            } else {
                if (!product_name || !product_price || !count) {
                    err = {
                        code: 404,
                        text: "Please Insert All information what we need."
                    }
                } else {
                    try {
                        const existProduct = await productRepo.getProductById(product_id);
                        if (!existProduct) {
                            err = {
                                code: 404,
                                text: `No products with id: ${product_id}`
                            }
                        } else {
                            const updateProduct = await productRepo.updateProduct(product_id, product_name, product_price, count);
                            Product = updateProduct
                        }
                    } catch (error) {
                        console.log("ProductController updateProduct error: " + error)
                    }
                }
            }
        }
    }
    return { Product, err }

}


// check if duplicate Product info or not
const duplicateProductInfo = async (Product) => {
    const isExists = await productRepo.checkIfProductExists(Product);
    return isExists
}

// get all products
const getAllProductsByBranchId = async (id) => {
    try {
        let err, products;
        const isBranchExist = await branchRepo.getBranchById(id)
        if (!isBranchExist) {
            err = {
                code: 400,
                text: `no branch with id: ${id}`
            }
        } else {
            products = await productRepo.getAllProductsByBranchId(id);
        }
        return { products, err }
    } catch (err) {
        console.log("ProductController getAllProductsByBranchId error: " + err)
    }
}

// get Product by id
const getProductById = async (id) => {
    let err;
    try {
        let Product = await productRepo.getProductById(id);
        if (!Product) {
            err = {
                code: 404,
                text: `No products with id: ${id}`
            }
        }
        return { Product, err }
    } catch (err) {
        console.log("ProductController getProductById error: " + err)
    }

}


// delete Product by id
const deleteProductById = async (id, token) => {
    try {
        let err, result;
        if (!token) {
            err = {
                code: 401,
                text: "please attach token."
            }
        } else {
            const isVerify = tokenValidate.isVerify(token);
            if (!isVerify) {
                err = {
                    code: 401,
                    text: "Invalid token"
                }
            } else {
                const isManager = tokenValidate.isManager(token);
                if (!isManager) {
                    err = {
                        code: 403,
                        text: "You have no permissions to delete products."
                    }
                } else {
                    let Product = await productRepo.getProductById(id);
                    if (!Product) {
                        err = {
                            code: 404,
                            text: `No products with id: ${id}`
                        }
                    } else {
                        await productRepo.deleteProductById(id);
                        result = `Product "${Product.product_name}" 's been deleted.`
                    }
                }
            }
        }
        return { result, err }
    } catch (err) {
        console.log("ProductController deleteProductById error: " + err)
    }

}


// this object is responsible for exporting functions of this file to other files
const productController = {
    createNewProduct,
    getAllProductsByBranchId,
    getProductById,
    deleteProductById,
    updateProduct,
}


module.exports = { productController }