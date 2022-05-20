const { bossRepo } = require('../repos/bossRepo')
const { tokenValidate } = require('./tokenValidate')
const bcrypt = require('bcryptjs');

// Create new boss 
const createNewBoss = async (boss_name, email, password) => {
    let err, new_boss;
    try {
        if (!boss_name || !email || !password) {
            err = {
                code: 403,
                text: 'Missing parameters. please insert all info to create new boss'
            }
        } else {
            const boss = {
                boss_name: boss_name,
                email: email,
                password: bcrypt.hashSync(password, 10) // hashing password to save it to db
            }
            const isExist = await bossRepo.getBossByEmail(boss.email);
            if (isExist) {
                err = {
                    code: 409,
                    text: 'Duplicate information. please change it'
                }
            } else {
                new_boss = await bossRepo.createNewBoss(boss);
            }
        }
        return { new_boss, err }
    } catch (error) {
        console.log("bossController createNewBoss error: " + error)
    }
}

// update boss 
const updateBoss = async (boss_id, boss_name, email, token) => {
    let err, new_boss;
    try {
        if (!token) {
            err = {
                code: 401,
                text: 'please attach token.'
            }
        } else {
            if (!tokenValidate.isBoss) {
                err = {
                    code: 401,
                    text: 'you have no permissions to update boss info.'
                }
            } else {
                if (!boss_name || !email) {
                    err = {
                        code: 403,
                        text: 'Missing parameters. please insert all info to create new boss'
                    }
                } else {
                    const boss = {
                        boss_id: boss_id,
                        boss_name: boss_name,
                        email: email,
                    }
                    const isExist = await bossRepo.getBossById(boss_id);
                    if (!isExist) {
                        err = {
                            code: 400,
                            text: `no boss with id: ${boss_id}`
                        }
                    } else {
                        new_boss = await bossRepo.updateBoss(boss);
                    }
                }
            }
        }
    } catch (error) {
        console.log("bossController updateBoss error: " + error)
    }
    return { new_boss, err }
}


// get boss by id
const getBossById = async (id) => {
    let boss, err;
    try {
        boss = await bossRepo.getBossById(id)
        if (!boss) {
            err = {
                code: 404,
                text: `no boss with id ${id}`
            }
        }
        return { boss, err }
    } catch (error) {
        console.log("bossController getBossById error: " + error)
    }
}


// get boss by email
const getBossByEmail = async (email) => {
    try {
        const boss = await bossRepo.getBossById(email)
        return boss
    } catch (error) {
        console.log("bossController getBossByEmail error: " + error)
    }
}

// delete boss by id
const deleteBossById = async (id) => {
    let err, result;
    try {
        const boss = await bossRepo.deleteBossById(id);
        if (!boss) {
            err = {
                code: 404,
                text: `No boss with id: ${id}`
            }
        } else {
            result = `boss with id: ${id} deleted successfully`
        }
        return { result, err }
    } catch (error) {
        console.log("bossController deleteBossById error: " + error)
    }
}


// this object is responsible for exporting functions of this file to other files
const bossController = {
    createNewBoss,
    getBossById,
    getBossByEmail,
    deleteBossById,
    updateBoss
}


module.exports = { bossController }
