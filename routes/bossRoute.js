const express = require('express');
const nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
const router = express.Router();
const { bossController } = require('../controllers/bossController')
const jwt = require('jsonwebtoken');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
    }
})
const upload = multer({ storage: storage })

// create new boss by form data 
router.post('/create', upload.none(), async (req, res) => {
    try {
        const { boss_name, email, password } = req.body;
        const boss = await bossController.createNewBoss(boss_name, email, password);
        if (!boss) {
            const err = "Please Insert All information what we need.";
            res.status(422).send(err)
        } else {
            res.send(boss)
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
