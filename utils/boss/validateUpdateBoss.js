const { bossRepo } = require('../../repos/bossRepo')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_encrypt = process.env.JWT_ENCRYPT;


const validateUpdateBoss = async (boss, token) => {
    const { boss_name, email } = boss;
    const { id } = jwt.decode(token, jwt_encrypt);

    // required inputs
    if (!(boss_name && email)) {
        const err = {
            code: 403,
            text: 'All inputs are required.'
        }
        return { err }
    }

    // check if exist
    const ExistBoss = await bossRepo.getBossById(id)
    if (!ExistBoss) {
        const err = {
            code: 409,
            text: `No boss with id : ${id}`
        }
        return { err }
    }

    const new_boss = {
        boss_id: id,
        boss_name: boss.boss_name,
        email: boss.email,
    }
    return { new_boss }
}
module.exports = validateUpdateBoss;