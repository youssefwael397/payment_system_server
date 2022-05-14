const { loginController } = require('../controllers/loginController')
const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer()


router.post('/', upload.none(), async (req, res) => {
    try {
        const { email, password } = req.body;
        const login_token = await loginController.login(email, password);

        if (login_token) {
            res.send(login_token)
        } else {
            res.status(403).send({
                status: 'error',
                "error": "bad credentials please login again"
            })
        }

    } catch (error) {
        res.status(503).send({
            status: 'error',
            error
        })
    }


})

module.exports = router
