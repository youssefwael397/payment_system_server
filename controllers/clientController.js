const { clientRepo } = require('../repos/clientRepo')
const { tokenValidate } = require('./tokenValidate')
const fs = require('fs');
const fsAsync = require('fs').promises;
const bcrypt = require('bcryptjs');
const { branchRepo } = require('../repos/branchRepo');
const { managerRepo } = require('../repos/managerRepo');

// Create new client
const createNewClient = async ({ sales_id, client_name, national_id, phone, work, home_address, work_address, facebook_link }, face_national_id_img, back_national_id_img, token) => {
    let err, new_client;
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
            const isSales = tokenValidate.isSales(token);
            if (!isSales) {
                err = {
                    code: 403,
                    text: "You have no permissions to add client."
                }
            } else {
                if (!sales_id || !client_name || !national_id || !phone || !work || !home_address || !work_address || !face_national_id_img || !back_national_id_img || !facebook_link) {
                    err = {
                        code: 404,
                        text: "Please Insert All information what we need."
                    }
                } else {
                    try {
                        const client = {
                            sales_id: sales_id,
                            client_name: client_name,
                            work: work,
                            work_address: work_address,
                            home_address: home_address,
                            national_id: national_id,
                            phone: phone,
                            face_national_id_img: face_national_id_img.filename,
                            back_national_id_img: back_national_id_img.filename,
                            facebook_link: facebook_link
                        }
                        const duplicateClient = await duplicateClientInfo(client);
                        if (duplicateClient) {
                            err = {
                                code: 409,
                                text: "Duplicate information. Please change it"
                            }
                            fs.unlinkSync(face_national_id_img.path)
                            fs.unlinkSync(back_national_id_img.path)
                        } else {
                            new_client = await clientRepo.createNewClient(client);
                        }
                    } catch (error) {
                        console.log("clientController createNewClient error: " + error)
                    }

                }
            }
        }
    }
    return { new_client, err }
}


// update client
const updateClient = async (client_id, client_name, email, national_id, phone, facebook_link, token) => {
    let err, client;
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
                    text: "You have no permissions to update client."
                }
            } else {
                if (!client_name || !email || !national_id || !phone || !facebook_link) {
                    err = {
                        code: 404,
                        text: "Please Insert All information what we need."
                    }
                } else {
                    try {
                        const existclient = await clientRepo.getclientById(client_id);
                        if (!existclient) {
                            err = {
                                code: 404,
                                text: `No client with id: ${client_id}`
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
                                client = await clientRepo.updateclient(client_id, client_name, email, national_id, phone, facebook_link);
                            }
                        }
                    } catch (error) {
                        console.log("clientController updateclient error: " + error)
                    }
                }
            }
        }
    }
    return { client, err }

}


// check if duplicate client info or not
const duplicateClientInfo = async (client) => {
    const isExists = await clientRepo.checkIfClientExists(client);
    return isExists
}

// get all client
const getAllClients = async (token) => {
    let err, client;
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
                        text: "You have no permissions to update client."
                    }
                } else {
                    client = await clientRepo.getAllclient();
                    let promises = [];
                    client.forEach((client) => {
                        promises.push(new Promise(async (resolve, reject) => {
                            const img = await fsAsync.readFile(`img/${client.client_img}`, { encoding: 'base64' })
                            const branch_img = await fsAsync.readFile(`img/${client.Branch.logo}`, { encoding: 'base64' })
                            const face_national_id_img = await fsAsync.readFile(`img/${client.face_national_id_img}`, { encoding: 'base64' })
                            const back_national_id_img = await fsAsync.readFile(`img/${client.back_national_id_img}`, { encoding: 'base64' })
                            client.client_img = img;
                            client.Branch.logo = branch_img;
                            client.face_national_id_img = face_national_id_img
                            client.back_national_id_img = back_national_id_img
                            resolve();
                        }))
                    })
                    await Promise.all(promises);
                }
            }
        }
        return { client, err }
    } catch (err) {
        console.log("clientController getAllclient error: " + err)
    }
}

// get client by id
const getclientById = async (id, token) => {
    let err, client;
    try {
        if (!token) {
            err = {
                code: 401,
                text: "please attach token."
            }
        } else {
            client = await clientRepo.getclientById(id);
            if (!client) {
                err = {
                    code: 404,
                    text: `No client with id: ${id}`
                }
            } else {
                const img = await fsAsync.readFile(`img/${client.client_img}`, { encoding: 'base64' })
                const branch_img = await fsAsync.readFile(`img/${client.Branch.logo}`, { encoding: 'base64' })
                const face_national_id_img = await fsAsync.readFile(`img/${client.face_national_id_img}`, { encoding: 'base64' })
                const back_national_id_img = await fsAsync.readFile(`img/${client.back_national_id_img}`, { encoding: 'base64' })
                client.client_img = img;
                client.Branch.logo = branch_img;
                client.face_national_id_img = face_national_id_img
                client.back_national_id_img = back_national_id_img
            }
        }
        return { client, err }
    } catch (err) {
        console.log("clientController getclientById error: " + err)
    }

}

const updateclientImage = async (id, client_img, token) => {
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
                        text: "You have no permissions to update client image."
                    }
                } else {
                    if (!client_img) {
                        err = {
                            code: 404,
                            text: "Please Attach client image."
                        }
                    } else {
                        const existclient = await clientRepo.getclientById(id);
                        if (!existclient) {
                            err = {
                                code: 404,
                                text: `No clients with id: ${id}`
                            }
                        } else {
                            const updateclient = await clientRepo.updateMangerImage(id, client_img.filename);
                            if (updateclient) {
                                fs.unlinkSync(`img/${existclient.client_img}`)
                                success = `client image updated successfully`
                            } else {
                                fs.unlinkSync(client_img.filename)
                            }
                        }

                    }
                }
            }
        }
        return { success, err }
    } catch (error) {
        console.log("clientController updateclientImage error: " + err)

    }
}


const updateclientNationalImages = async (id, face_national_id_img, back_national_id_img, token) => {
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
                        const existclient = await clientRepo.getclientById(id);
                        if (!existclient) {
                            err = {
                                code: 404,
                                text: `No clients with id: ${id}`
                            }
                        } else {
                            const updateclient = await clientRepo.updateclientNationalImages(id, face_national_id_img.filename, back_national_id_img.filename);
                            if (updateclient) {
                                fs.unlinkSync(`img/${existclient.face_national_id_img}`)
                                fs.unlinkSync(`img/${existclient.back_national_id_img}`)
                                success = `client national-id images updated successfully`
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
        console.log("clientController updateclientNationalImages error: " + err)

    }
}

// get client by id
const deleteClientById = async (id, token) => {
    console.log("deleteClientById")
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
                        text: "You have no permissions to delete clients."
                    }
                } else {
                    console.log("isBoss")

                    let client = await clientRepo.getclientById(id);
                    if (!client) {
                        err = {
                            code: 404,
                            text: `No clients with id: ${id}`
                        }
                    } else {
                        fs.unlinkSync(`img/${client.client_img}`)
                        fs.unlinkSync(`img/${client.face_national_id_img}`)
                        fs.unlinkSync(`img/${client.back_national_id_img}`)
                        await clientRepo.deleteclientById(id);
                        result = `client "${client.client_name}" 's been deleted.`
                    }
                }
            }
        }
        return { result, err }
    } catch (err) {
        console.log("clientController deleteclientById error: " + err)
    }

}





// this object is responsible for exporting functions of this file to other files
const clientController = {
    createNewClient,
    getAllClients,
    getclientById,
    deleteClientById,
    updateClient,
    updateclientImage,
    updateclientNationalImages
}


module.exports = { clientController }
