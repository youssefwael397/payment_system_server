const { Sales, Branch, Sequelize, sequelize } = require('../models/index')
const jwt = require('jsonwebtoken');
const op = Sequelize.Op;

// Create new sales 
const createNewSales = async (sales) => {
    try {
        const new_sales = await Sales.create(sales);
        return new_sales
    } catch (error) {
        console.log("salesRepo createNewSales error: " + error)
    }
}


// update sales info
const updateSales = async (sales_id, sales_name, email, national_id, phone, facebook_link) => {
    let updated_sales;
    try {
        await Sales.update(
            {
                sales_name, email, national_id, phone, facebook_link
            },
            {
                where: { sales_id: sales_id }
            }
        );
        updated_sales = await Sales.findOne({ where: { sales_id: sales_id } })
        return updated_sales

    } catch (error) {
        console.log("salesRepo updateSales error: " + error)
    }
}


// update sales logo img
const updateSalesImage = async (sales_id, image) => {
    try {
        await Sales.update(
            {
                sales_img: image
            },
            {
                where: { sales_id: sales_id }
            }
        );
        let updated_sales = await Sales.findOne({ where: { sales_id: sales_id } })
        return updated_sales

    } catch (error) {
        console.log("salesRepo updateLogoImage error: " + error)
    }
}



// update sales national imgs
const updateSalesNationalImages = async (id, face_national_id_img, back_national_id_img) => {
    try {
        await Sales.update(
            {
                face_national_id_img: face_national_id_img,
                back_national_id_img: back_national_id_img
            },
            {
                where: { sales_id: id }
            }
        );
        let updated_sales = await Sales.findOne({ where: { sales_id: id } })
        return updated_sales

    } catch (error) {
        console.log("salesRepo updateSalesNationalImages error: " + error)
    }
}


// get all sales
const getAllSales = async () => {
    try {
        const sales = await Sales.findAll({
            include: {
                model: Branch,
            }
        });
        return sales
    } catch (error) {
        console.log("salesRepo getAllSales error: " + error)
    }
}


// get all sales
const getAllSalesByBranchId = async (id) => {
    try {
        const sales = await Sales.findAll({
            where: {
                branch_id: id
            },
            include: {
                model: Branch,
            }
        });
        return sales
    } catch (error) {
        console.log("salesRepo getAllSales error: " + error)
    }
}


// get sales by id
const getSalesById = async (id) => {
    try {
        const sales = await Sales.findOne({
            where: { sales_id: id },
            include: {
                model: Branch,
            }
        });
        return sales
    } catch (error) {
        console.log("salesRepo getSalesById error: " + error)
    }
}

// get sales by email
const getSalesByEmail = async (email) => {
    try {
        const sales = await Sales.findOne({
            where: { email: email }
        });
        return sales
    } catch (error) {
        console.log("salesRepo getSalesByEmail error: " + error)
    }
}

// get sales by id
const deleteSalesById = async (id) => {
    try {
        const sales = await Sales.destroy({ where: { sales_id: id } });
        return sales
    } catch (error) {
        console.log("salesRepo deleteSalesById error: " + error)
    }
}

const checkIfSalesExists = async (sales) => {
    const exist_sales = await Sales.findOne({
        where: {
            [op.or]: [
                { email: sales.email },
                { national_id: sales.national_id },
                { phone: sales.phone },
                { facebook_link: sales.facebook_link },
            ]
        },
    });

    if (exist_sales) {
        return true
    } else {
        return false
    }

}

// this object is responsible for exporting functions of this file to other files
const salesRepo = {
    createNewSales,
    checkIfSalesExists,
    getAllSales,
    getSalesById,
    getAllSalesByBranchId,
    getSalesByEmail,
    deleteSalesById,
    updateSales,
    updateSalesImage,
    updateSalesNationalImages
}


module.exports = { salesRepo }
