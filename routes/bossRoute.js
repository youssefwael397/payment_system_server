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



// create 
router.post('/create', upload.none(), async (req, res) => {
    try {
        const { create_boss, err } = await bossController.createNewBoss(req.body);
        if (err) {
            res.status(err.code).send({
                status: "error",
                error: err.text
            })
        } else {
            res.send(create_boss)
        }
    } catch (error) {
        res.status(403).send({
            status: "error",
            error: error
        })
    }

})

// update 
router.put('/update/:boss_id', upload.none(), async (req, res) => {
    const { boss_name, email } = req.body;
    const token = req.body.token || req.headers.authorization
    const { boss_id } = req.params
    try {
        const { new_boss, err } = await bossController.updateBoss(boss_id, boss_name, email, token);
        if (err) {
            res.status(err.code).send({
                status: "error",
                error: err.text
            })
        } else {
            res.send(new_boss)
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
        const { boss, err } = await bossController.getBossById(req.params.id);
        if (err) {
            res.status(err.code).send({
                status: "error",
                error: err.text
            })
        }
        res.send(boss)
    } catch (error) {
        res.status(403).send({
            status: "error",
            error
        })
    }

})

// delete boss by id as params
router.delete('/:id', async (req, res) => {
    try {
        const { result, err } = await bossController.deleteBossById(req.params.id);
        if (err) {
            res.status(err.code).send({
                status: "error",
                error: err.text
            })
        }
        res.send(result)
    } catch (error) {
        res.status(403).send({
            status: "error",
            error
        })
    }

})


module.exports = router
