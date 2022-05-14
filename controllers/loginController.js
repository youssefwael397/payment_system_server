const { bossRepo } = require('../repos/bossRepo')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const haram_encrypt = "14sa5f684wlv327asiagoR*#(UY)3h8ruck";

const login = async (email, password) => {
    const boss = await bossRepo.getBossByEmail(email);
    const isValid = await bcrypt.compare(password, boss.password);
    const login_token = jwt.sign({
        id: boss.boss_id,
        name: boss.boss_name,
        email: boss.email,
        is_boss: isValid,
        is_manager: false,
        is_sales: false,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // one week expiration
    }, haram_encrypt)
    return login_token
}

const loginController = {
    login
}

module.exports = { loginController }