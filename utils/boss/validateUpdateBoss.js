const { bossRepo } = require('../../repos/bossRepo')
const bcrypt = require('bcryptjs');


const validateUpdateBoss = async (boss) => {
    const { boss_id, boss_name, email } = boss;
    let err;

    if (!(boss_id && boss_name && email)) {
        err = {
            code: 403,
            text: 'All inputs are required.'
        }
        return { err }
    }

    const ExistBoss = await bossRepo.getBossByEmail(email)
    if (!ExistBoss) {
        err = {
            code: 409,
            text: `No boss with id : ${boss.boss_id}`
        }
        return { err }
    }

    const new_boss = {
        boss_name: boss.boss_name,
        email: boss.email,
        password: bcrypt.hashSync(boss.password, 10) // hashing password to save it to db
    }
    return { new_boss }
}
module.exports = validateUpdateBoss;