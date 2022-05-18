// imports
const { Boss, Sequelize, sequelize } = require('../models/index')
const fs = require('fs');
const jwt = require('jsonwebtoken');
const op = Sequelize.Op;

// Create new boss 
const createNewBoss = async (boss) => {
    try {
        const new_boss = await Boss.create(boss);
        return new_boss
    } catch (error) {
        console.log("bossRepo createNewBoss error: " + error)
    }
}

// get boss by id
const getBossById = async (id) => {
    try {
        const boss = await Boss.findOne({ where: { boss_id: id } });
        return boss
    } catch (error) {
        console.log("bossRepo getBossById error: " + error)
    }
}


// get boss by email
const getBossByEmail = async (email) => {
    try {
        const boss = await Boss.findOne({ where: { email: email } });
        return boss
    } catch (error) {
        console.log("bossRepo getBossByEmail error: " + error)
    }
}


// delete boss by id
const deleteBossById = async (id) => {
    try {
        const boss = await Boss.destroy({ where: { boss_id: id } });
        if (boss) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log("bossRepo deleteBossById error: " + error)
    }
}

// this object is responsible for exporting functions of this file to other files
const bossRepo = {
    createNewBoss,
    getBossById,
    getBossByEmail,
    deleteBossById,
}


module.exports = { bossRepo }
