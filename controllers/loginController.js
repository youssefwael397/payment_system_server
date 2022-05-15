const { bossRepo } = require('../repos/bossRepo')
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwt_encrypt = process.env.JWT_ENCRYPT;

const login = async (email, password) => {
    let err = '',
        login_token = '';
    console.log("login controller")
    const boss = await bossRepo.getBossByEmail(email);
    if (!boss) {
        err = {
            code: 404,
            text: "This email is not found."
        }
    } else {
        const isValid = await bcrypt.compare(password, boss.password);
        if (!isValid) {
            err = {
                code: 401,
                text: "Bad credentials. Please Try Again..."
            }
        }
        login_token = jwt.sign({
            id: boss.boss_id,
            name: boss.boss_name,
            email: boss.email,
            is_boss: isValid,
            is_manager: false,
            is_sales: false,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // one week expiration
        }, jwt_encrypt)
    }

    return { login_token, err }
}

const loginController = {
    login
}

module.exports = { loginController }