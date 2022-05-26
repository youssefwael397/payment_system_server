const { Manager, Branch, Sequelize, sequelize } = require('../models/index')
const jwt = require('jsonwebtoken');
const op = Sequelize.Op;

// Create new manager 
const createNewManager = async (manager) => {
    try {
        const new_manager = await Manager.create(manager);
        return new_manager
    } catch (error) {
        console.log("managerRepo createNewManager error: " + error)
    }
}


// update manager info
const updateManager = async ({manager_id, manager_name, email, national_id, phone, facebook_link}) => {
    let updated_manager;
    try {
        await Manager.update(
            {
                manager_name, email, national_id, phone, facebook_link
            },
            {
                where: { manager_id: manager_id }
            }
        );
        updated_manager = await Manager.findOne({ where: { manager_id: manager_id } })
        return updated_manager

    } catch (error) {
        console.log("managerRepo updateManager error: " + error)
    }
}


// update manager logo img
const updateMangerImage = async ({manager_id, manager_img}) => {
    try {
        await Manager.update(
            {
                manager_img: manager_img
            },
            {
                where: { manager_id: manager_id }
            }
        );
        let updated_manager = await Manager.findOne({ where: { manager_id: manager_id } })
        return updated_manager

    } catch (error) {
        console.log("managerRepo updateLogoImage error: " + error)
    }
}



// update manager national imgs
const updateManagerNationalImages = async ({manager_id, face_national_id_img, back_national_id_img}) => {
    try {
        await Manager.update(
            {
                face_national_id_img: face_national_id_img,
                back_national_id_img: back_national_id_img
            },
            {
                where: { manager_id: manager_id }
            }
        );
        let updated_manager = await Manager.findOne({ where: { manager_id: id } })
        return updated_manager

    } catch (error) {
        console.log("managerRepo face_national_id_img error: " + error)
    }
}



// get all managers
const getAllManagers = async () => {
    try {
        const managers = await Manager.findAll({
            include: {
                model: Branch
            }
        });
        return managers
    } catch (error) {
        console.log("managerRepo getAllManagers error: " + error)
    }
}

// get manager by id
const getManagerById = async (id) => {
    try {
        const manager = await Manager.findOne({
            where: { manager_id: id },
            include: {
                model: Branch
            }
        });
        return manager
    } catch (error) {
        console.log("managerRepo getManagerById error: " + error)
    }
}

// get manager by email
const getManagerByEmail = async (email) => {
    try {
        const manager = await Manager.findOne({
            where: { email: email }
        });
        return manager
    } catch (error) {
        console.log("managerRepo getManagerByEmail error: " + error)
    }
}

// get manager by id
const deleteManagerById = async (id) => {
    try {
        const manager = await Manager.destroy({ where: { manager_id: id } });
        return manager
    } catch (error) {
        console.log("managerRepo deleteManagerById error: " + error)
    }
}

const checkIfManagerExists = async (manager) => {
    const exist_manager = await Manager.findOne({
        where: {
            [op.or]: [
                { manager_name: manager.manager_name },
                { branch_id: manager.branch_id },
                { email: manager.email },
                { national_id: manager.national_id },
                { phone: manager.phone },
                { facebook_link: manager.facebook_link },
            ]
        },
    });

    if (exist_manager) {
        return true
    } else {
        return false
    }

}

// this object is responsible for exporting functions of this file to other files
const managerRepo = {
    createNewManager,
    checkIfManagerExists,
    getAllManagers,
    getManagerById,
    getManagerByEmail,
    deleteManagerById,
    updateManager,
    updateMangerImage,
    updateManagerNationalImages
}


module.exports = { managerRepo }
