const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
const router = express.Router();
const { managerController } = require('../controllers/managerController')
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

// create new manager by form data 
router.post('/create', upload.any(), async (req, res) => {
    const {
        branch_id,
        manager_name,
        email,
        password,
        national_id,
        phone,
        facebook_link,
    } = req.body;
    const token = req.body.token || req.headers.authorization
    const images = req.files;
    const manager_img = images[0];
    const face_national_id_img = images[1];
    const back_national_id_img = images[2];
    try {
        const { new_manager, err } = await managerController.createNewManager(branch_id, manager_name, email, password, national_id, phone, manager_img, face_national_id_img, back_national_id_img, facebook_link, token);
        if (err) {
            fs.unlinkSync(manager_img.path)
            fs.unlinkSync(face_national_id_img.path)
            fs.unlinkSync(back_national_id_img.path)
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(new_manager)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})

// update manager by form data 
router.put('/update/:manager_id', upload.none(), async (req, res) => {
    const { manager_name, email, national_id, phone, facebook_link } = req.body;
    const { manager_id } = req.params;
    const token = req.body.token || req.headers.authorization
    try {
        const { manager, err } = await managerController.updateManager(manager_id, manager_name, email, national_id, phone, facebook_link, token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(manager)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})

// update manager image by form data 
router.put('/update/image/:id', upload.single('manager_img'), async (req, res) => {
    const { id } = req.params
    const token = req.body.token || req.headers.authorization
    const manager_img = req.file;

    try {
        const { success, err } = await managerController.updateManagerImage(id, manager_img, token);
        if (err) {
            fs.unlinkSync(manager_img.path)
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


// update manager national id images by form data 
router.put('/update/national-images/:id', upload.any(), async (req, res) => {
    const { id } = req.params
    const token = req.body.token || req.headers.authorization
    const images = req.files;
    const face_national_id_img = images[0];
    const back_national_id_img = images[1];
    try {
        const { success, err } = await managerController.updateManagerNationalImages(id, face_national_id_img, back_national_id_img, token);
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


// get all managers
router.get('/', async (req, res) => {
    const token = req.body.token || req.headers.authorization
    try {
        const { managers, err } = await managerController.getAllManagers(token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(managers)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})


// get manager by id
router.get('/:id', async (req, res) => {
    const token = req.body.token || req.headers.authorization
    const { id } = req.params;
    try {
        const { manager, err } = await managerController.getManagerById(id, token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(manager)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})


// delete manager by id
router.delete('/:id', async (req, res) => {
    try {
        const token = req.body.token || req.headers.authorization
        const { id } = req.params;
        const { result, err } = await managerController.deleteManagerById(id, token);
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
