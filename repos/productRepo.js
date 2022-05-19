// imports
const { Product, Sequelize, sequelize } = require('../models/index')
const op = Sequelize.Op;

// Create new Product 
const createNewProduct = async (product) => {
    try {
        const new_Product = await Product.create(product);
        return new_Product
    } catch (error) {
        console.log("ProductRepo createNewProduct error: " + error)
    }
}

// update Product 
const updateProduct = async (product_id, product_name, product_price, count) => {
    try {
        await Product.update({
            product_name: product_name,
            product_price: product_price,
            count: count,
        },
            {
                where: { product_id, product_id }
            }
        );
        const update_Product = await Product.findOne({
            where: { product_id, product_id }
        })
        return update_Product
    } catch (error) {
        console.log("ProductRepo updateProduct error: " + error)
    }
}

const getAllProductsByBranchId = async (id) => {
    try {
        const products = await Product.findAll({ where: { branch_id: id } });
        return products
    } catch (error) {
        console.log("ProductRepo getAllProductsByBranchId error: " + error)
    }
}

// get Product by id
const getProductById = async (id) => {
    try {
        const product = await Product.findOne({ where: { Product_id: id } });
        return product
    } catch (error) {
        console.log("ProductRepo getProductById error: " + error)
    }
}


// get Product by name
const getProductByName = async (name) => {
    try {
        const Product = await Product.findOne({ where: { product_name: name } });
        return Product
    } catch (error) {
        console.log("ProductRepo getProductByName error: " + error)
    }
}


// delete Product by id
const deleteProductById = async (id) => {
    try {
        const product = await Product.destroy({ where: { product_id: id } });
        if (product) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log("ProductRepo deleteProductById error: " + error)
    }
}


const checkIfProductExists = async (product) => {
    const exist_Product = await Product.findOne({
        where: {
            product_name: product.product_name,
            branch_id: product.branch_id
        },
    });

    if (exist_Product) {
        return true
    } else {
        return false
    }

}



// this object is responsible for exporting functions of this file to other files
const productRepo = {
    createNewProduct,
    getProductById,
    getProductByName,
    getAllProductsByBranchId,
    deleteProductById,
    checkIfProductExists,
    updateProduct
}


module.exports = { productRepo }
