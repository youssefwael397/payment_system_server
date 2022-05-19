const { branchRepo } = require('../repos/branchRepo')
const { tokenValidate } = require('./tokenValidate')
const fs = require('fs');
const fsAsync = require('fs').promises;

// Create new branch
const createNewBranch = async (branch_name, branch_address, logoImg, token) => {
    let err, new_branch;
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


// update branch info
const updateBranch = async (branch_id, branch_name, branch_address, token) => {
    let err, branch;
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
        let promises = [];
        branches.forEach((branch) => {
            promises.push(new Promise(async (resolve, reject) => {
                const img = await fsAsync.readFile(`img/${branch.logo}`, { encoding: 'base64' })
                branch.logo = img
                resolve();
            }))
        })
        await Promise.all(promises);
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
        } else {
            const img = await fsAsync.readFile(`img/${branch.logo}`, { encoding: 'base64' })
            branch.logo = img
        }
        return { branch, err }
    } catch (err) {
        console.log("branchController getBranchById error: " + err)
    }

}

// update branch logo image 
const updateLogoImage = async (id, logoImg, token) => {
    try {
        let success, err;
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
                        text: "You have no permissions to update logo image."
                    }
                } else {
                    if (!logoImg) {
                        err = {
                            code: 404,
                            text: "Please Attach logo image."
                        }
                    } else {
                        const existBranch = await branchRepo.getBranchById(id);
                        if (!existBranch) {
                            err = {
                                code: 404,
                                text: `No Branches with id: ${id}`
                            }
                            fs.unlinkSync(`img/${logoImg.filename}`)
                        } else {
                            const updateBranch = await branchRepo.updateLogoImage(id, logoImg.filename);
                            if (updateBranch) {
                                fs.unlinkSync(`img/${existBranch.logo}`)
                                success = `logo image updated successfully`
                            }
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


// delete branch by id
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
                const isBoss = tokenValidate.isBoss(token);
                if (!isBoss) {
                    err = {
                        code: 403,
                        text: "You have no permissions to delete branches."
                    }
                } else {
                    let branch = await branchRepo.getBranchById(id);
                    if (!branch) {
                        err = {
                            code: 404,
                            text: `No Branches with id: ${id}`
                        }
                    } else {
                        const previous_logo = fs.readFile(`img/${branch.logo}`)
                        if (previous_logo) {
                            fs.unlinkSync(`img/${branch.logo}`)
                        }
                        await branchRepo.deleteBranchById(id);
                        result = `Branch "${branch.branch_name}" 's been deleted.`
                    }
                }
            }
        }
        return { result, err }
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
