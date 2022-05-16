const { branchRepo } = require('../repos/branchRepo')
const { tokenValidate } = require('./tokenValidate')
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Create new branch
const createNewBranch = async (branch_name, branch_address, logoImg, token) => {
    let err, new_branch;
    const isVerify = tokenValidate.isVerify(token);
    console.log(isVerify)
    if (!isVerify) {
        err = {
            code: 401,
            text: "Invalid token"
        }
    } else {
        const isBoss = tokenValidate.isVerify(token);
        if (!isBoss) {
            err = {
                code: 403,
                text: "You have no permissions to delete branches."
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
                    console.log("branchController createNewBranch error: " + error)
                }

            }
        }
    }
    return { new_branch, err }
}


// Create new branch
const updateBranch = async (branch_id, branch_name, branch_address, token) => {
    let err, branch;
    console.log(token)
    const isValid = tokenValidate.isVerify(token);
    // console.log(token)
    console.log("isValid")
    console.log(isValid)
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
                text: "You have no permissions to update branches."
            }
        } else {
            if (!branch_id || !branch_name || !branch_address) {
                err = {
                    code: 404,
                    text: "Please Insert All information what we need."
                }
            } else {

                try {
                    const existBranch = await getBranchById(branch_id);
                    if (!existBranch.branch) {
                        err = {
                            code: 404,
                            text: `No Branches with id: ${branch_id}`
                        }
                    } else {
                        const updateBranch = await branchRepo.updateBranch(branch_id, branch_name, branch_address);
                        branch = updateBranch
                    }
                } catch (error) {
                    console.log("branchController updateBranch error: " + error)
                }
            }
        }
    }
    return { branch, err }

}


// check if duplicate branch info or not
const duplicateBranchInfo = async (branch) => {
    const isExists = await branchRepo.checkIfBranchExists(branch);
    return isExists
}

// get all branches
const getAllBranches = async () => {
    try {
        const branches = await branchRepo.getAllBranches();
        return branches
    } catch (err) {
        console.log("branchController getAllBranches error: " + err)
    }
}

// get branch by id
const getBranchById = async (id) => {
    let err;
    try {
        let branch = await branchRepo.getBranchById(id);
        if (!branch) {
            err = {
                code: 404,
                text: `No Branches with id: ${id}`
            }
        }
        return { branch, err }
    } catch (err) {
        console.log("branchController getBranchById error: " + err)
    }

}

const updateLogoImage = async (id, logoImg, token) => {
    try {
        let success, err;
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
                if (!logoImg) {
                    err = {
                        code: 404,
                        text: "Please Attach logo image."
                    }
                } else {
                    const existBranch = await getBranchById(id);
                    if (!existBranch.branch) {
                        err = {
                            code: 404,
                            text: `No Branches with id: ${id}`
                        }
                        fs.unlinkSync(`img/${logoImg.filename}`)
                    } else {
                        const updateBranch = await branchRepo.updateLogoImage(id, logoImg.filename);
                        if (updateBranch) {
                            fs.unlinkSync(`img/${existBranch.branch.logo}`)
                            success = `logo image updated successfully`
                        }
                    }

                }
            }
        }
        return { success, err }
    } catch (error) {
        console.log("branchController updateLogoImage error: " + err)

    }
}


// get branch by id
const deleteBranchById = async (id, token) => {
    try {
        let err, result;
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
                const isBoss = tokenValidate.isVerify(token);
                if (!isBoss) {
                    err = {
                        code: 403,
                        text: "You have no permissions to delete branches."
                    }
                } else {
                    let { branch } = await getBranchById(id);
                    if (!branch) {
                        err = {
                            code: 404,
                            text: `No Branches with id: ${id}`
                        }
                    } else {
                        fs.unlinkSync(`img/${branch.logo}`)
                        await branchRepo.deleteBranchById(id);
                        result = `Branch "${branch.branch_name}" 's been deleted.`
                    }
                }
            }
            return { result, err }
        }
    } catch (err) {
        console.log("branchController deleteBranchById error: " + err)
    }

}





// this object is responsible for exporting functions of this file to other files
const branchController = {
    createNewBranch,
    getAllBranches,
    getBranchById,
    deleteBranchById,
    updateBranch,
    updateLogoImage
}


module.exports = { branchController }
