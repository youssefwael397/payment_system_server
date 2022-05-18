const { managerRepo } = require('../repos/managerRepo')
const { tokenValidate } = require('./tokenValidate')
const fs = require('fs');
const fsAsync = require('fs').promises;
const bcrypt = require('bcryptjs');

// Create new manager
const createNewManager = async (branch_id, manager_name, email, password, national_id, phone, manager_img, face_national_id_img, back_national_id_img, facebook_link, token) => {
    let err, new_manager;
    if (!token) {
        err = {
            code: 401,
            text: "please attach token."
        }
    } else {
        const isVerify = tokenValidate.isVerify(token);
        if (!isVerify) {
            err = {
                code: 401,
                text: "Invalid token"
            }
        } else {
            const isBoss = tokenValidate.isBoss(token);
            if (!isBoss) {
                err = {
                    code: 403,
                    text: "You have no permissions to add managers."
                }
            } else {
                if (!branch_id || !manager_name || !email || !password || !national_id || !phone || !manager_img || !facebook_link) {
                    err = {
                        code: 404,
                        text: "Please Insert All information what we need."
                    }
                } else {
                    try {
                        const manager = {
                            branch_id: branch_id,
                            manager_name: manager_name,
                            email: email,
                            password: bcrypt.hashSync(password, 10),
                            national_id: national_id,
                            phone: phone,
                            manager_img: manager_img.filename,
                            face_national_id_img: face_national_id_img.filename,
                            back_national_id_img: back_national_id_img.filename,
                            facebook_link: facebook_link
                        }
                        const duplicateManager = await duplicateManagerInfo(manager);
                        if (duplicateManager) {
                            err = {
                                code: 409,
                                text: "Duplicate information. You cannot add more than one manager to the same branch."
                            }
                        } else {
                            new_manager = await managerRepo.createNewManager(manager);
                        }
                    } catch (error) {
                        console.log("managerController createNewManager error: " + error)
                    }

                }
            }
        }
    }
    return { new_manager, err }
}


// update manager
const updateManager = async (manager_id, manager_name, email, national_id, phone, facebook_link, token) => {
    let err, manager;
    if (!token) {
        err = {
            code: 401,
            text: "please attach token."
        }
    } else {
        const isValid = tokenValidate.isVerify(token);
        if (!isValid) {
            err = {
                code: 401,
                text: "Invalid token"
            }
        } else {
            const isBoss = tokenValidate.isBoss(token);
            if (!isBoss) {
                err = {
                    code: 403,
                    text: "You have no permissions to update managers."
                }
            } else {
                if (!manager_name || !email || !national_id || !phone || !facebook_link) {
                    err = {
                        code: 404,
                        text: "Please Insert All information what we need."
                    }
                } else {

                    try {
                        const existManager = await managerRepo.getManagerById(manager_id);
                        if (!existManager) {
                            err = {
                                code: 404,
                                text: `No managers with id: ${manager_id}`
                            }
                        } else {
                            const updateManager = await managerRepo.updateManager(manager_id, manager_name, email, national_id, phone, facebook_link);
                            manager = updateManager
                        }
                    } catch (error) {
                        console.log("managerController updateManager error: " + error)
                    }
                }
            }
        }
    }
    return { manager, err }

}


// check if duplicate manager info or not
const duplicateManagerInfo = async (manager) => {
    const isExists = await managerRepo.checkIfManagerExists(manager);
    return isExists
}

// get all managers
const getAllManagers = async (token) => {
    let err, managers;
    try {
        if (!token) {
            err = {
                code: 401,
                text: "please attach token."
            }
        } else {
            const isValid = tokenValidate.isVerify(token);
            if (!isValid) {
                err = {
                    code: 401,
                    text: "Invalid token"
                }
            } else {
                const isBoss = tokenValidate.isBoss(token);
                if (!isBoss) {
                    err = {
                        code: 403,
                        text: "You have no permissions to update managers."
                    }
                } else {
                    managers = await managerRepo.getAllManagers();
                    let promises = [];
                    managers.forEach((manager) => {
                        promises.push(new Promise(async (resolve, reject) => {
                            const img = await fsAsync.readFile(`img/${manager.manager_img}`, { encoding: 'base64' })
                            const branch_img = await fsAsync.readFile(`img/${manager.Branch.logo}`, { encoding: 'base64' })
                            const face_national_id_img = await fsAsync.readFile(`img/${manager.face_national_id_img}`, { encoding: 'base64' })
                            const back_national_id_img = await fsAsync.readFile(`img/${manager.back_national_id_img}`, { encoding: 'base64' })
                            manager.manager_img = img;
                            manager.Branch.logo = branch_img;
                            manager.face_national_id_img = face_national_id_img
                            manager.back_national_id_img = back_national_id_img
                            resolve();
                        }))
                    })
                    await Promise.all(promises);
                }
            }
        }
        return { managers, err }
    } catch (err) {
        console.log("managerController getAllManagers error: " + err)
    }
}

// get manager by id
const getManagerById = async (id, token) => {
    let err, manager;
    try {
        if (!token) {
            err = {
                code: 401,
                text: "please attach token."
            }
        } else {
            manager = await managerRepo.getManagerById(id);
            if (!manager) {
                err = {
                    code: 404,
                    text: `No managers with id: ${id}`
                }
            } else {
                const img = await fsAsync.readFile(`img/${manager.manager_img}`, { encoding: 'base64' })
                const branch_img = await fsAsync.readFile(`img/${manager.Branch.logo}`, { encoding: 'base64' })
                const face_national_id_img = await fsAsync.readFile(`img/${manager.face_national_id_img}`, { encoding: 'base64' })
                const back_national_id_img = await fsAsync.readFile(`img/${manager.back_national_id_img}`, { encoding: 'base64' })
                manager.manager_img = img;
                manager.Branch.logo = branch_img;
                manager.face_national_id_img = face_national_id_img
                manager.back_national_id_img = back_national_id_img
            }
        }
        return { manager, err }
    } catch (err) {
        console.log("managerController getManagerById error: " + err)
    }

}

const updateManagerImage = async (id, manager_img, token) => {
    let success, err;
    try {
        if (!token) {
            err = {
                code: 401,
                text: "Invalid token"
            }
        } else {
            const isVerify = tokenValidate.isVerify(token);
            if (!isVerify) {
                err = {
                    code: 401,
                    text: "Invalid token"
                }
            } else {
                const isBoss = tokenValidate.isBoss(token);
                if (!isBoss) {
                    err = {
                        code: 403,
                        text: "You have no permissions to update manager image."
                    }
                } else {
                    if (!manager_img) {
                        err = {
                            code: 404,
                            text: "Please Attach manager image."
                        }
                    } else {
                        const existManager = await managerRepo.getManagerById(id);
                        if (!existManager) {
                            err = {
                                code: 404,
                                text: `No managers with id: ${id}`
                            }
                        } else {
                            const updateManager = await managerRepo.updateMangerImage(id, manager_img.filename);
                            if (updateManager) {
                                fs.unlinkSync(`img/${existManager.manager_img}`)
                                success = `manager image updated successfully`
                            } else {
                                fs.unlinkSync(manager_img.filename)
                            }
                        }

                    }
                }
            }
        }
        return { success, err }
    } catch (error) {
        console.log("managerController updateManagerImage error: " + err)

    }
}


const updateManagerNationalImages = async (id, face_national_id_img, back_national_id_img, token) => {
    let success, err;
    try {
        if (!token) {
            err = {
                code: 401,
                text: "Invalid token"
            }
        } else {
            const isVerify = tokenValidate.isVerify(token);
            if (!isVerify) {
                err = {
                    code: 401,
                    text: "Invalid token"
                }
            } else {
                const isBoss = tokenValidate.isBoss(token);
                if (!isBoss) {
                    err = {
                        code: 403,
                        text: "You have no permissions to update logo image."
                    }
                } else {
                    if (!face_national_id_img || !face_national_id_img) {
                        err = {
                            code: 404,
                            text: "Please Attach national-id images."
                        }
                    } else {
                        const existManager = await managerRepo.getManagerById(id);
                        if (!existManager) {
                            err = {
                                code: 404,
                                text: `No managers with id: ${id}`
                            }
                        } else {
                            const updateManager = await managerRepo.updateManagerNationalImages(id, face_national_id_img.filename, back_national_id_img.filename);
                            if (updateManager) {
                                fs.unlinkSync(`img/${existManager.face_national_id_img}`)
                                fs.unlinkSync(`img/${existManager.back_national_id_img}`)
                                success = `manager national-id images updated successfully`
                            } else {
                                fs.unlinkSync(face_national_id_img.filename)
                                fs.unlinkSync(back_national_id_img.filename)
                            }
                        }

                    }
                }
            }
        }
        return { success, err }
    } catch (error) {
        console.log("managerController updateManagerNationalImages error: " + err)

    }
}

// get manager by id
const deleteManagerById = async (id, token) => {
    console.log("deleteManagerById")
    try {
        let err, result;
        if (!token) {
            console.log('token isnot esists')

            err = {
                code: 401,
                text: "please attach token."
            }
        } else {
            console.log('token is esists')
            const isVerify = tokenValidate.isVerify(token);
            if (!isVerify) {
                err = {
                    code: 401,
                    text: "Invalid token"
                }
            } else {
                const isBoss = tokenValidate.isBoss(token);
                if (!isBoss) {
                    err = {
                        code: 403,
                        text: "You have no permissions to delete managers."
                    }
                } else {
                    console.log("isBoss")

                    let manager = await managerRepo.getManagerById(id);
                    if (!manager) {
                        err = {
                            code: 404,
                            text: `No managers with id: ${id}`
                        }
                    } else {
                        fs.unlinkSync(`img/${manager.manager_img}`)
                        fs.unlinkSync(`img/${manager.face_national_id_img}`)
                        fs.unlinkSync(`img/${manager.back_national_id_img}`)
                        await managerRepo.deleteManagerById(id);
                        result = `manager "${manager.manager_name}" 's been deleted.`
                    }
                }
            }
        }
        return { result, err }
    } catch (err) {
        console.log("managerController deleteManagerById error: " + err)
    }

}





// this object is responsible for exporting functions of this file to other files
const managerController = {
    createNewManager,
    getAllManagers,
    getManagerById,
    deleteManagerById,
    updateManager,
    updateManagerImage,
    updateManagerNationalImages
}


module.exports = { managerController }
