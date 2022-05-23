const express = require('express');
const auth = require('../middleware/auth')
const boss = require('../middleware/boss')
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

// create new branch by form data 
router.post('/create', auth, boss, upload.single('logo'), async (req, res) => {
    const { branch_name, branch_address } = req.body;
    const logoImg = req.file;
    try {
        const { new_branch, err } = await branchController.createNewBranch(branch_name, branch_address, logoImg);
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
        fs.unlinkSync(logoImg.path)
        res.status(500).send({
            status: "error",
            error
        })
    }

})

// update branch by form data 
router.put('/update/:branch_id', upload.none(), async (req, res) => {
    const { branch_name, branch_address } = req.body;
    const { branch_id } = req.params;
    const token = req.body.token || req.headers.authorization
    try {
        const { branch, err } = await branchController.updateBranch(branch_id, branch_name, branch_address, token);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(branch)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})

// update branch logo image by form data 
router.put('/update/image/:id', upload.single('logo'), async (req, res) => {
    const { id } = req.params
    const token = req.body.token || req.headers.authorization
    const logoImg = req.file;
    try {
        const { success, err } = await branchController.updateLogoImage(id, logoImg, token);
        if (err) {
            fs.unlinkSync(logoImg.path)
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

// get all branches
router.get('/', async (req, res) => {
    try {
        const branches = await branchController.getAllBranches();
        res.send(branches)
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})


// get branch by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { branch, err } = await branchController.getBranchById(id);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })
        } else {
            res.send(branch)
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error
        })
    }

})


// delete branch by id
router.delete('/:id', async (req, res) => {
    const token = req.body.token || req.headers.authorization
    const { id } = req.params;
    try {
        const { result, err } = await branchController.deleteBranchById(id, token);
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
