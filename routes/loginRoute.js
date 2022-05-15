const { loginController } = require('../controllers/loginController')
const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer()


router.post('/', upload.none(), async (req, res) => {
    try {
        const { email, password } = req.body;
        const { login_token, err } = await loginController.login(email, password);
        if (err) {
            res.status(err.code).send({
                status: 'error',
                "error": err.text
            })

        } else {
            res.send(login_token)
        }

    } catch (error) {
        res.status(503).send({
            status: 'error',
            error
        })
    }


})

module.exports = router
