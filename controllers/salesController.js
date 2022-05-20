const { salesRepo } = require('../repos/salesRepo')
const { tokenValidate } = require('./tokenValidate')
const fs = require('fs');
const fsAsync = require('fs').promises;
const bcrypt = require('bcryptjs');
const { branchRepo } = require('../repos/branchRepo');
const { managerRepo } = require('../repos/managerRepo');

// Create new sales
const createNewSales = async (branch_id, manager_id, sales_name, email, password, national_id, phone, sales_img, face_national_id_img, back_national_id_img, facebook_link, token) => {
    let err, new_sales;
    console.log('first')
    if (!token) {
        console.log('second')
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
            const isManager = tokenValidate.isManager(token);
            if (!isManager) {
                err = {
                    code: 403,
                    text: "You have no permissions to add sales."
                }
            } else {
                if (!branch_id || !manager_id || !sales_name || !email || !password || !national_id || !phone || !facebook_link) {
                    err = {
                        code: 404,
                        text: "Please Insert All information what we need."
                    }
                } else {
                    try {
                        console.log("try")
                        const sales = {
                            branch_id: branch_id,
                            manager_id: manager_id,
                            sales_name: sales_name,
                            email: email,
                            password: bcrypt.hashSync(password, 10),
                            national_id: national_id,
                            phone: phone,
                            sales_img: sales_img.filename,
                            face_national_id_img: face_national_id_img.filename,
                            back_national_id_img: back_national_id_img.filename,
                            facebook_link: facebook_link
                        }
                        const duplicateSales = await duplicateSalesInfo(sales);
                        if (duplicateSales) {
                            err = {
                                code: 409,
                                text: "Duplicate information. Please change it"
                            }
                            fs.unlinkSync(sales_img.path)
                            fs.unlinkSync(face_national_id_img.path)
                            fs.unlinkSync(back_national_id_img.path)
                        } else {
                            new_sales = await salesRepo.createNewSales(sales);
                        }
                    } catch (error) {
                        console.log("salesController createNewSales error: " + error)
                    }

                }
            }
        }
    }
    return { new_sales, err }
}


// update sales
const updateSales = async (sales_id, sales_name, email, national_id, phone, facebook_link, token) => {
    let err, sales;
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
            const isManager = tokenValidate.isManager(token);
            if (!isManager) {
                err = {
                    code: 403,
                    text: "You have no permissions to update sales."
                }
            } else {
                if (!sales_name || !email || !national_id || !phone || !facebook_link) {
                    err = {
                        code: 404,
                        text: "Please Insert All information what we need."
                    }
                } else {
                    try {
                        const existSales = await salesRepo.getSalesById(sales_id);
                        if (!existSales) {
                            err = {
                                code: 404,
                                text: `No sales with id: ${sales_id}`
                            }
                        } else {
                            const isBranchExists = await branchRepo.getBranchById(branch_id)
                            const isManagerExists = await managerRepo.getManagerById(manager_id)
                            if (!isBranchExists || !isManagerExists) {
                                if (!isManagerExists) {
                                    err = {
                                        code: 400,
                                        text: `There is no managers with id : ${manager_id}`
                                    }
                                }
                                if (!isBranchExists)
                                    err = {
                                        code: 400,
                                        text: `There is no branches with id : ${branch_id}`
                                    }
                            } else {
                                sales = await salesRepo.updateSales(sales_id, sales_name, email, national_id, phone, facebook_link);
                            }
                        }
                    } catch (error) {
                        console.log("salesController updateSales error: " + error)
                    }
                }
            }
        }
    }
    return { sales, err }

}


// check if duplicate sales info or not
const duplicateSalesInfo = async (sales) => {
    const isExists = await salesRepo.checkIfSalesExists(sales);
    return isExists
}

// get all sales
const getAllSales = async (token) => {
    let err, sales;
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
                        text: "You have no permissions to update sales."
                    }
                } else {
                    sales = await salesRepo.getAllSales();
                    let promises = [];
                    sales.forEach((sales) => {
                        promises.push(new Promise(async (resolve, reject) => {
                            const img = await fsAsync.readFile(`img/${sales.sales_img}`, { encoding: 'base64' })
                            const branch_img = await fsAsync.readFile(`img/${sales.Branch.logo}`, { encoding: 'base64' })
                            const face_national_id_img = await fsAsync.readFile(`img/${sales.face_national_id_img}`, { encoding: 'base64' })
                            const back_national_id_img = await fsAsync.readFile(`img/${sales.back_national_id_img}`, { encoding: 'base64' })
                            sales.sales_img = img;
                            sales.Branch.logo = branch_img;
                            sales.face_national_id_img = face_national_id_img
                            sales.back_national_id_img = back_national_id_img
                            resolve();
                        }))
                    })
                    await Promise.all(promises);
                }
            }
        }
        return { sales, err }
    } catch (err) {
        console.log("salesController getAllsales error: " + err)
    }
}

// get sales by id
const getSalesById = async (id, token) => {
    let err, sales;
    try {
        if (!token) {
            err = {
                code: 401,
                text: "please attach token."
            }
        } else {
            sales = await salesRepo.getSalesById(id);
            if (!sales) {
                err = {
                    code: 404,
                    text: `No sales with id: ${id}`
                }
            } else {
                const img = await fsAsync.readFile(`img/${sales.sales_img}`, { encoding: 'base64' })
                const branch_img = await fsAsync.readFile(`img/${sales.Branch.logo}`, { encoding: 'base64' })
                const face_national_id_img = await fsAsync.readFile(`img/${sales.face_national_id_img}`, { encoding: 'base64' })
                const back_national_id_img = await fsAsync.readFile(`img/${sales.back_national_id_img}`, { encoding: 'base64' })
                sales.sales_img = img;
                sales.Branch.logo = branch_img;
                sales.face_national_id_img = face_national_id_img
                sales.back_national_id_img = back_national_id_img
            }
        }
        return { sales, err }
    } catch (err) {
        console.log("salesController getSalesById error: " + err)
    }

}

const updateSalesImage = async (id, sales_img, token) => {
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
                        text: "You have no permissions to update sales image."
                    }
                } else {
                    if (!sales_img) {
                        err = {
                            code: 404,
                            text: "Please Attach sales image."
                        }
                    } else {
                        const existsales = await salesRepo.getsalesById(id);
                        if (!existsales) {
                            err = {
                                code: 404,
                                text: `No saless with id: ${id}`
                            }
                        } else {
                            const updatesales = await salesRepo.updateMangerImage(id, sales_img.filename);
                            if (updatesales) {
                                fs.unlinkSync(`img/${existsales.sales_img}`)
                                success = `sales image updated successfully`
                            } else {
                                fs.unlinkSync(sales_img.filename)
                            }
                        }

                    }
                }
            }
        }
        return { success, err }
    } catch (error) {
        console.log("salesController updatesalesImage error: " + err)

    }
}


const updateSalesNationalImages = async (id, face_national_id_img, back_national_id_img, token) => {
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
                        const existsales = await salesRepo.getsalesById(id);
                        if (!existsales) {
                            err = {
                                code: 404,
                                text: `No saless with id: ${id}`
                            }
                        } else {
                            const updatesales = await salesRepo.updatesalesNationalImages(id, face_national_id_img.filename, back_national_id_img.filename);
                            if (updatesales) {
                                fs.unlinkSync(`img/${existsales.face_national_id_img}`)
                                fs.unlinkSync(`img/${existsales.back_national_id_img}`)
                                success = `sales national-id images updated successfully`
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
        console.log("salesController updatesalesNationalImages error: " + err)

    }
}

// get sales by id
const deleteSalesById = async (id, token) => {
    console.log("deletesalesById")
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
                        text: "You have no permissions to delete saless."
                    }
                } else {
                    console.log("isBoss")

                    let sales = await salesRepo.getsalesById(id);
                    if (!sales) {
                        err = {
                            code: 404,
                            text: `No saless with id: ${id}`
                        }
                    } else {
                        fs.unlinkSync(`img/${sales.sales_img}`)
                        fs.unlinkSync(`img/${sales.face_national_id_img}`)
                        fs.unlinkSync(`img/${sales.back_national_id_img}`)
                        await salesRepo.deletesalesById(id);
                        result = `sales "${sales.sales_name}" 's been deleted.`
                    }
                }
            }
        }
        return { result, err }
    } catch (err) {
        console.log("salesController deletesalesById error: " + err)
    }

}





// this object is responsible for exporting functions of this file to other files
const salesController = {
    createNewSales,
    getAllSales,
    getSalesById,
    deleteSalesById,
    updateSales,
    updateSalesImage,
    updateSalesNationalImages
}


module.exports = { salesController }
