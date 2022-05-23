const { bossRepo } = require('../../repos/bossRepo')
const bcrypt = require('bcryptjs');


const validateCreateBoss = async (boss) => {
    const { boss_name, email, password } = boss;
    let err, new_boss;

    if (!(boss_name && email && password)) {
        err = {
            code: 403,
            text: 'All inputs are required.'
        }
        return { err }
    }

    const ExistBoss = await bossRepo.getBossByEmail(email)
    if (ExistBoss) {
        err = {
            code: 409,
            text: 'This Boss is already exist.'
        }
        return { err }
    }

    new_boss = {
        boss_name: boss.boss_name,
        email: boss.email,
        password: bcrypt.hashSync(boss.password, 10) // hashing password to save it to db
    }
    return { new_boss }
}
module.exports = validateCreateBoss;