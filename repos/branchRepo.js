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


// get branch by name
const getBranchByName = async (name) => {
    try {
        const branch = await Branch.findOne({ where: { branch_name: name } });
        return branch
    } catch (error) {
        console.log("branchRepo getBranchByName error: " + error)
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
    getBranchByName,
    checkIfBranchExists
}


module.exports = { branchRepo }
