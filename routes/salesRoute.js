const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
const router = express.Router();
const { salesController } = require('../controllers/salesController')
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

// create new sales by form data 
router.post('/create', upload.any(), async (req, res) => {
    const {
        branch_id,
        manager_id,
        sales_name,
        email,
        password,
        national_id,
        phone,
        facebook_link,
    } = req.body;
    const token = req.body.token || req.headers.authorization
    const images = req.files;
    const sales_img = images[0];
    const face_national_id_img = images[1];
    const back_national_id_img = images[2];
    try {
        const { new_sales, err } = await salesController.createNewSales(branch_id, manager_id, sales_name, email, password, national_id, phone, sales_img, face_national_id_img, back_national_id_img, facebook_link, token);
        if (err) {
            fs.unlinkSync(sales_img.path)
            fs.unlinkSync(face_national_id_img.path)
            fs.unlinkSync(back_national_id_img.path)
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(new_sales)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})

// update sales by form data 
router.put('/update/:sales_id', upload.none(), async (req, res) => {
    const { sales_name, email, national_id, phone, facebook_link } = req.body;
    const { sales_id } = req.params;
    const token = req.body.token || req.headers.authorization
    try {
        const { sales, err } = await salesController.updateSales(sales_id, sales_name, email, national_id, phone, facebook_link, token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(sales)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})

// update sales image by form data 
router.put('/update/image/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params
    const token = req.body.token || req.headers.authorization
    const sales_img = req.file;
    try {
        const { success, err } = await salesController.updateSalesImage(id, sales_img, token);
        if (err) {
            fs.unlinkSync(sales_img.path)
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(success)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})


// update sales national id images by form data 
router.put('/update/national-images/:id', upload.any(), async (req, res) => {
    const { id } = req.params
    const token = req.body.token || req.headers.authorization
    const images = req.files;
    const face_national_id_img = images[0];
    const back_national_id_img = images[1];
    try {
        const { success, err } = await salesController.updateSalesNationalImages(id, face_national_id_img, back_national_id_img, token);
        if (err) {
            fs.unlinkSync(face_national_id_img.path)
            fs.unlinkSync(back_national_id_img.path)
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(success)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})



// get all sales
router.get('/', async (req, res) => {
    const token = req.body.token || req.headers.authorization
    try {
        const { sales, err } = await salesController.getAllSales(token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(sales)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})


// get sales by id
router.get('/:id', async (req, res) => {
    const token = req.body.token || req.headers.authorization
    const { id } = req.params;
    try {
        const { sales, err } = await salesController.getSalesById(id, token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(sales)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})


// delete sales by id
router.delete('/:id', async (req, res) => {
    try {
        const token = req.body.token || req.headers.authorization
        const { id } = req.params;
        const { result, err } = await salesController.deletesalesById(id, token);
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
