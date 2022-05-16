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

// create new branch by form data 
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
        res.status(500).send({
            status: "error",
            error
        })
    }

})

// update branch by form data 
router.put('/update', upload.none(), async (req, res) => {
    try {
        const { branch_id, branch_name, branch_address } = req.body;
        const token = req.body.token || req.headers.authorization
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

// update branch by form data 
router.put('/update/image/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params
        const token = req.body.token || req.headers.authorization
        const logoImg = req.file;
        const { success, err } = await branchController.updateLogoImage(id, logoImg, token);
        console.log(success)
        console.log(err)
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
    try {
        const { id } = req.params;
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
    try {
        const token = req.body.token || req.headers.authorization
        const { id } = req.params;
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
