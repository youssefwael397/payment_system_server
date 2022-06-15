const { bossRepo } = require('../repos/bossRepo')
const { managerRepo } = require('../repos/managerRepo')
const { salesRepo } = require('../repos/salesRepo')
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt_encrypt = process.env.JWT_ENCRYPT;
const jwt = require('jsonwebtoken');

const login = async (email, password) => {
    let err, login_token, isBoss = false, isManager = false, isSales = false;

    const boss = await bossRepo.getBossByEmail(email);
    const manager = await managerRepo.getManagerByEmail(email);
    const sales = await salesRepo.getSalesByEmail(email);
    console.log(sales)
    if (!boss && !manager && !sales) {
        err = {
            code: 404,
            text: "يرجى التأكد من البريد الإلكتروني"
        }
    } else {
        if (boss) {
            isBoss = await bcrypt.compare(password, boss.password);
        }
        if (manager) {
            isManager = await bcrypt.compare(password, manager.password);
        }
        if (sales) {
            isSales = await bcrypt.compare(password, sales.password);
        }
        if (!isBoss && !isManager && !isSales) {
            err = {
                code: 401,
                text: "كلمة المرور غير صحيحة"
            }
        } else {
            if (boss) {
                login_token = jwt.sign({
                    id: boss.boss_id,
                    name: boss.boss_name,
                    email: boss.email,
                    is_boss: isBoss,
                    is_manager: isManager,
                    is_sales: isSales,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // one week expiration
                }, jwt_encrypt)
            } else if (manager) {
                login_token = jwt.sign({
                    id: manager.manager_id,
                    name: manager.manager_name,
                    email: manager.email,
                    is_boss: isBoss,
                    is_manager: isManager,
                    is_sales: isSales,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // one week expiration
                }, jwt_encrypt)
            } else if (sales) {
                login_token = jwt.sign({
                    id: sales.sales_id,
                    name: sales.sales_name,
                    email: sales.email,
                    is_boss: isBoss,
                    is_manager: isManager,
                    is_sales: isSales,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // one week expiration
                }, jwt_encrypt)
            }

        }
    }

    return { login_token, err }
}

const loginController = {
    login
}

module.exports = { loginController }