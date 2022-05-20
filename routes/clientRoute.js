const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
const router = express.Router();
const { clientController } = require('../controllers/clientController')
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

// create new client by form data 
router.post('/create', upload.any(), async (req, res) => {
    const token = req.body.token || req.headers.authorization
    const images = req.files;
    const face_national_id_img = images[0];
    const back_national_id_img = images[1];
    try {
        const { new_client, err } = await clientController.createNewClient(req.body, face_national_id_img, back_national_id_img, token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(new_client)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})

// update client by form data 
router.put('/update/:client_id', upload.none(), async (req, res) => {
    const { client_name, email, national_id, phone, facebook_link } = req.body;
    const { client_id } = req.params;
    const token = req.body.token || req.headers.authorization
    try {
        const { client, err } = await clientController.updateclient(client_id, client_name, email, national_id, phone, facebook_link, token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(client)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})

// update client image by form data 
router.put('/update/image/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params
    const token = req.body.token || req.headers.authorization
    const client_img = req.file;
    try {
        const { success, err } = await clientController.updateclientImage(id, client_img, token);
        if (err) {
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


// update client national id images by form data 
router.put('/update/national-images/:id', upload.any(), async (req, res) => {
    const { id } = req.params
    const token = req.body.token || req.headers.authorization
    const images = req.files;
    const face_national_id_img = images[0];
    const back_national_id_img = images[1];
    try {
        const { success, err } = await clientController.updateclientNationalImages(id, face_national_id_img, back_national_id_img, token);
        if (err) {
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



// get all client
router.get('/', async (req, res) => {
    const token = req.body.token || req.headers.authorization
    try {
        const { client, err } = await clientController.getAllclient(token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(client)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})


// get client by id
router.get('/:id', async (req, res) => {
    const token = req.body.token || req.headers.authorization
    const { id } = req.params;
    try {
        const { client, err } = await clientController.getclientById(id, token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(client)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})


// delete client by id
router.delete('/:id', async (req, res) => {
    try {
        const token = req.body.token || req.headers.authorization
        const { id } = req.params;
        const { result, err } = await clientController.deleteclientById(id, token);
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
