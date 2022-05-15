const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
const router = express.Router();
const { branchController } = require('../controllers/branchController')
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

// create new boss by form data 
router.post('/create', upload.single('logo'), async (req, res) => {
    try {
        const { branch_name, branch_address } = req.body;
        const token = req.body.token || req.headers.authorization
        const logoImg = req.file;
        const { new_branch, err } = await branchController.createNewBranch(branch_name, branch_address, logoImg, token);
        if (err) {
            fs.unlinkSync(logoImg.path)

            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(new_branch)
        }
    } catch (error) {
        res.status(403).send({
            status: "error",
            error
        })
    }

})

// get boss by id as params
router.get('/:id', async (req, res) => {
    try {
        const boss = await bossController.getBossById(req.params.id);
        res.send(boss)
    } catch (error) {
        res.status(403).send({
            status: "error",
            error
        })
    }

})

module.exports = router
