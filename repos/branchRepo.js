const { Branch, Sequelize, sequelize } = require('../models/index')
const jwt = require('jsonwebtoken');
const op = Sequelize.Op;

// Create new branch 
const createNewBranch = async (branch) => {
    try {
        const new_branch = await Branch.create(branch);
        return new_branch
    } catch (error) {
        console.log("branchRepo createNewBranch error: " + error)
    }
}


// update branch 
const updateBranch = async ({branch_id, branch_name, branch_address}) => {
    let updated_branch;
    try {
        await Branch.update(
            {
                branch_name: branch_name,
                branch_address: branch_address
            },
            {
                where: { branch_id: branch_id }
            }
        );
        updated_branch = await Branch.findOne({ where: { branch_id: branch_id } })
        return updated_branch

    } catch (error) {
        console.log("branchRepo updateBranch error: " + error)
    }
}


// update branch logo img
const updateLogoImage = async (branch_id, logo) => {
    try {
        await Branch.update(
            {
                logo: logo
            },
            {
                where: { branch_id: branch_id }
            }
        );
        let updated_branch = await Branch.findOne({ where: { branch_id: branch_id } })
        return updated_branch

    } catch (error) {
        console.log("branchRepo updateLogoImage error: " + error)
    }
}



// get all branches
const getAllBranches = async () => {
    try {
        const branches = await Branch.findAll();
        return branches
    } catch (error) {
        console.log("branchRepo getAllBranches error: " + error)
    }
}

// get branch by id
const getBranchById = async (id) => {
    try {
        const branch = await Branch.findOne({ where: { branch_id: id } });
        return branch
    } catch (error) {
        console.log("branchRepo getBranchById error: " + error)
    }
}


// get branch by id
const deleteBranchById = async (id) => {
    try {
        const branch = await Branch.destroy({ where: { branch_id: id } });
        return branch
    } catch (error) {
        console.log("branchRepo getBranchById error: " + error)
    }
}

const checkIfBranchExists = async (branch) => {
    const exist_branch = await Branch.findOne({
        where: {
            [op.or]: [
                { branch_name: branch.branch_name },
                { branch_address: branch.branch_address },
            ]
        },
    });

    if (exist_branch) {
        return true
    } else {
        return false
    }

}

// this object is responsible for exporting functions of this file to other files
const branchRepo = {
    createNewBranch,
    checkIfBranchExists,
    getAllBranches,
    getBranchById,
    deleteBranchById,
    updateBranch,
    updateLogoImage
}


module.exports = { branchRepo }
