const { bossRepo } = require('../repos/bossRepo')
const bcrypt = require('bcryptjs');

// Create new boss 
const createNewBoss = async (boss_name, email, password) => {
    if (!boss_name || !email || !password) {
        return false
    } else {
        try {
            const boss = {
                boss_name: boss_name,
                email: email,
                password: bcrypt.hashSync(password, 10)
            }
            const new_boss = await bossRepo.createNewBoss(boss);
            return new_boss
        } catch (error) {
            console.log("bossController createNewBoss error: " + error)
        }
    }
}

// get boss by id
const getBossById = async (id) => {
    try {
        const boss = await bossRepo.getBossById(id)
        return boss
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
    try {
        const boss = await bossRepo.deleteBossById(id);
        return boss
    } catch (error) {
        console.log("bossController deleteBossById error: " + error)
    }
}


// this object is responsible for exporting functions of this file to other files
const bossController = {
    createNewBoss,
    getBossById,
    getBossByEmail,
    deleteBossById
}


module.exports = { bossController }
