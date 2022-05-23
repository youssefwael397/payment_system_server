const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
const router = express.Router();
const { productController } = require('../controllers/productController')
const jwt = require('jsonwebtoken');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: './img',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
    }
})
const upload = multer({ storage: storage })

// create new Product by form data 
router.post('/create', upload.none(), async (req, res) => {
    const { category_id, branch_id, product_name, product_price, count } = req.body;
    const token = req.body.token || req.headers.authorization;
    try {
        const { new_Product, err } = await productController.createNewProduct(category_id, branch_id, product_name, product_price, count, token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(new_Product)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})

// update Product by form data 
router.put('/update/:Product_id', upload.none(), async (req, res) => {
    const { product_name, product_price, count } = req.body;
    const { Product_id } = req.params;
    const token = req.body.token || req.headers.authorization
    try {
        const { Product, err } = await productController.updateProduct(Product_id, product_name, product_price, count, token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(Product)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})

// get all categories by branch id
router.get('/branch/:id', async (req, res) => {
    const { id } = req.params
    try {

        const { products, err } = await productController.getAllProductsByBranchId(id);
        if (err) {
            res.status(err.code).send({ status: 'error', error: err.text })
        } else {
            res.send(products)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})

// get Product by id
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const { Product, err } = await productController.getProductById(id);
        if (err) {
            res.status(err.code).send({
                status: "error",
                error: err.text
            })
        } else {
            res.send(Product)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})



// delete Product by id
router.delete('/:id', async (req, res) => {
    const token = req.body.token || req.headers.authorization
    const { id } = req.params;
    try {
        const { result, err } = await productController.deleteProductById(id, token);
        if (err) {
            res.status(err.code).send({
                status: "error",
                error: err.text
            })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})


module.exports = router
