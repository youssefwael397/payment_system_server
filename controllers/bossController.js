const { bossRepo } = require('../repos/bossRepo')
const validateCreateBoss = require('../utils/boss/validateCreateBoss')
const validateUpdateBoss = require('../utils/boss/validateUpdateBoss')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_encrypt = process.env.JWT_ENCRYPT;

// Create
const createNewBoss = async (boss) => {
    try {
        const { new_boss, err } = await validateCreateBoss(boss);
        if (err) return { err }

        const create_boss = await bossRepo.createNewBoss(new_boss);
        return { create_boss }

    } catch (error) {
        console.log("bossController createNewBoss error: " + error)
    }
}

// update by token
const updateBoss = async (boss, token) => {
    try {
        const { new_boss, err } = await validateUpdateBoss(boss, token);
        if (err) return { err }

        const update_boss = await bossRepo.updateBoss(new_boss);
        return { update_boss }

    } catch (error) {
        console.log("bossController updateBoss error: " + error)
    }
    return { new_boss, err }
}

// get by token
const getBossById = async (token) => {
    try {
        const { id } = jwt.decode(token, jwt_encrypt);
        const boss = await bossRepo.getBossById(id)
        if (!boss) {
            const err = {
                code: 404,
                text: `No boss with id : ${id}`
            }
            return { err }
        }
        return { boss }
    } catch (error) {
        console.log("bossController getBossById error: " + error)
    }
}

// delete by token
const deleteBossById = async (token) => {
    try {
        const { id, name } = jwt.decode(token, jwt_encrypt);
        const boss = await bossRepo.getBossById(id)
        if (!boss) {
            const err = {
                code: 404,
                text: `No boss with id : ${id}`
            }
            return { err }
        }
        await bossRepo.deleteBossById(id)
        const result = {
            code: 404,
            text: `Boss "${name}" deleted successfully`
        }
        return { result }
    } catch (error) {
        console.log("bossController deleteBossById error: " + error)
    }
}


// this object is responsible for exporting functions of this file to other files
const bossController = {
    createNewBoss,
    getBossById,
    deleteBossById,
    updateBoss
}


module.exports = { bossController }
