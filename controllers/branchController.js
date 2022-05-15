const { branchRepo } = require('../repos/branchRepo')
const { tokenValidate } = require('./tokenValidate')
const bcrypt = require('bcryptjs');

// Create new boss 
const createNewBranch = async (branch_name, branch_address, logoImg, token) => {
    let err, new_branch;
    const is_boss = tokenValidate.isBoss(token);
    if (!is_boss) {
        err = {
            code: 403,
            text: "You have no permissions to create branches."
        }
    } else {
        if (!branch_name || !branch_address || !logoImg) {
            err = {
                code: 404,
                text: "Please Insert All information what we need."
            }
        } else {
            try {
                const branch = {
                    branch_name: branch_name,
                    branch_address: branch_address,
                    logo: logoImg.filename
                }
                const duplicateBranch = await duplicateBranchInfo(branch);
                if (duplicateBranch) {
                    err = {
                        code: 409,
                        text: "Duplicate information. Please Change It."
                    }
                } else {
                    new_branch = await branchRepo.createNewBranch(branch);
                }
            } catch (error) {
                console.log("branchController createNewBranch error: " + error.code)
            }
        }
    }
    return { new_branch, err }
}


// check if duplicate info or not
const duplicateBranchInfo = async (branch) => {
    const isExists = await branchRepo.checkIfBranchExists(branch);
    return isExists
}

// get boss by id
const getBossById = async (id) => {
    try {
        const boss = await bossRepo.getBossById(id)
        return boss
    } catch (error) {
        console.log("branchController getBossById error: " + error)
    }
}


// get boss by email
const getBossByEmail = async (email) => {
    try {
        const boss = await bossRepo.getBossById(email)
        return boss
    } catch (error) {
        console.log("branchController getBossByEmail error: " + error)
    }
}

// delete boss by id
const deleteBossById = async (id) => {
    try {
        const boss = await bossRepo.deleteBossById(id);
        return boss
    } catch (error) {
        console.log("branchController deleteBossById error: " + error)
    }
}


// this object is responsible for exporting functions of this file to other files
const branchController = {
    createNewBranch,
}


module.exports = { branchController }
