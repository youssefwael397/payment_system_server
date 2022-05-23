const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
const router = express.Router();
const { categoryController } = require('../controllers/categoryController')
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

// create new category by form data 
router.post('/create', upload.none(), async (req, res) => {
    const { category_name, branch_id } = req.body;
    const token = req.body.token || req.headers.authorization;
    try {
        const { new_category, err } = await categoryController.createNewCategory(category_name, branch_id, token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(new_category)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})

// update category by form data 
router.put('/update/:category_id', upload.none(), async (req, res) => {
    const { category_name } = req.body;
    const { category_id } = req.params;
    const token = req.body.token || req.headers.authorization
    try {
        const { category, err } = await categoryController.updateCategory(category_id, category_name, token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(category)
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
        const { categories, err } = await categoryController.getAllCategoriesByBranchId(id);
        if (err) {
            res.status(err.code).send({ status: 'error', error: err.text })
        } else {
            res.send(categories)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})

// get category by id
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const { category, err } = await categoryController.getCategoryById(id);
        if (err) {
            res.status(err.code).send({
                status: "error",
                error: err.text
            })
        } else {
            res.send(category)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})



// delete category by id
router.delete('/:id', async (req, res) => {
    const token = req.body.token || req.headers.authorization
    const { id } = req.params;
    try {
        const { result, err } = await categoryController.deleteCategoryById(id, token);
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
