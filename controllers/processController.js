const { clientRepo } = require('../repos/clientRepo')
const { processRepo } = require('../repos/processRepo')
const { productRepo } = require('../repos/productRepo')
const { tokenValidate } = require('./tokenValidate')
const fs = require('fs');
const fsAsync = require('fs').promises;
const bcrypt = require('bcryptjs');


const createProcessValidateError = async (process) => {
    let err;
    const {
        client_id,
        product_id,
        first_price,
        month_count,
        percent,
        first_date,
        second_date,
        product_price,
        product_price_after_percent,
        discount,
        final_price
    } = process;

    // validate if user doesn't insert client id
    if (!client_id) {
        err = {
            code: 400,
            text: 'missing client_id. please insert client_id.'
        }
    } else {
        const clientExist = await clientRepo.getClientById(client_id)
        if (!clientExist) {
            err = {
                code: 400,
                text: `no client with id : ${client_id}. please insert valid client_id.`
            }
        }
    }

    // validate if user doesn't insert product id
    if (!product_id) {
        err = {
            code: 400,
            text: 'missing product_id. please insert product_id.'
        }
    } else {
        const productExist = await productRepo.getProductById(product_id)
        if (!productExist) {
            err = {
                code: 400,
                text: `no product with id : ${product_id}. please insert valid product_id.`
            }
        }
    }

    // validate if user doesn't insert first_price
    if (!first_price) {
        err = {
            code: 400,
            text: 'missing first_price. please insert valid first_price.'
        }
    }

    // validate if user doesn't insert month_count
    if (!month_count) {
        err = {
            code: 400,
            text: 'missing month_count. please insert valid month_count.'
        }
    }

    // validate if user doesn't insert percent
    if (!percent) {
        err = {
            code: 400,
            text: 'missing percent. please insert valid percent.'
        }
    }

    // validate if user doesn't insert first_date
    if (!first_date) {
        err = {
            code: 400,
            text: 'missing first_date. please insert valid first_date.'
        }
    }

    // validate if user doesn't insert second_date
    if (!second_date) {
        err = {
            code: 400,
            text: 'missing second_date. please insert valid second_date.'
        }
    }

    // validate if user doesn't insert product_price
    if (!product_price) {
        err = {
            code: 400,
            text: 'missing product_price. please insert valid product_price.'
        }
    }

    // validate if user doesn't insert product_price_after_percent
    if (!product_price_after_percent) {
        err = {
            code: 400,
            text: 'missing product_price_after_percent. please insert valid product_price_after_percent.'
        }
    }

    // validate if user doesn't insert discount
    if (!discount) {
        err = {
            code: 400,
            text: 'missing discount. please insert valid discount.'
        }
    }

    // validate if user doesn't insert discount
    if (!final_price) {
        err = {
            code: 400,
            text: 'missing final_price. please insert valid final_price.'
        }
    }

    return err
}



// Create new process
const createNewProcess = async (p) => {
    try {

        return 'ok'

    } catch (error) {
        console.log("processController createNewProcess error: " + error)
    }
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
                        const existClient = await clientRepo.getClientById(client_id);
                        if (!existClient) {
                            err = {
                                code: 404,
                                text: `No client with id: ${client_id}`
                            }
                        } else {
                            client = await clientRepo.updateClient(client_id, client_name, email, national_id, phone, facebook_link);
                        }
                    } catch (error) {
                        console.log("clientController updateClient error: " + error)
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
    let err, clients;
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
                const isSales = tokenValidate.isSales(token);
                if (!isSales) {
                    err = {
                        code: 403,
                        text: "You have no permissions to update client."
                    }
                } else {
                    clients = await clientRepo.getAllClients();
                    let promises = [];
                    clients.forEach((client) => {
                        promises.push(new Promise(async (resolve, reject) => {
                            const face_national_id_img = await fsAsync.readFile(`img/${client.face_national_id_img}`, { encoding: 'base64' })
                            const back_national_id_img = await fsAsync.readFile(`img/${client.back_national_id_img}`, { encoding: 'base64' })
                            client.face_national_id_img = face_national_id_img
                            client.back_national_id_img = back_national_id_img
                            resolve();
                        }))
                    })
                    await Promise.all(promises);
                }
            }
        }
    } catch (err) {
        console.log("clientController getAllClients error: " + err)
    }
    return { clients, err }
}

// get client by id
const getClientById = async (id, token) => {
    let err, client;
    try {
        if (!token) {
            err = {
                code: 401,
                text: "please attach token."
            }
        } else {
            client = await clientRepo.getClientById(id);
            if (!client) {
                err = {
                    code: 404,
                    text: `No client with id: ${id}`
                }
            } else {
                const face_national_id_img = await fsAsync.readFile(`img/${client.face_national_id_img}`, { encoding: 'base64' })
                const back_national_id_img = await fsAsync.readFile(`img/${client.back_national_id_img}`, { encoding: 'base64' })
                client.face_national_id_img = face_national_id_img
                client.back_national_id_img = back_national_id_img
            }
        }
        return { client, err }
    } catch (err) {
        console.log("clientController getClientById error: " + err)
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
                        const existClient = await clientRepo.getClientById(id);
                        if (!existClient) {
                            err = {
                                code: 404,
                                text: `No clients with id: ${id}`
                            }
                        } else {
                            const updateClient = await clientRepo.updateClientImage(id, client_img.filename);
                            if (updateClient) {
                                fs.unlinkSync(`img/${existClient.client_img}`)
                                success = `client image updated successfully`
                            } else {
                                err = {
                                    code: 500,
                                    text: 'failed to update client image'
                                }
                            }
                        }

                    }
                }
            }
        }
        return { success, err }
    } catch (error) {
        console.log("clientController updateClientImage error: " + err)

    }
}


const updateClientNationalImages = async (id, face_national_id_img, back_national_id_img, token) => {
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
                        const existClient = await clientRepo.getClientById(id);
                        if (!existClient) {
                            err = {
                                code: 404,
                                text: `No clients with id: ${id}`
                            }
                        } else {
                            const updateClient = await clientRepo.updateClientNationalImages(id, face_national_id_img.filename, back_national_id_img.filename);
                            if (updateClient) {
                                fs.unlinkSync(`img/${existClient.face_national_id_img}`)
                                fs.unlinkSync(`img/${existClient.back_national_id_img}`)
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
        console.log("clientController updateClientNationalImages error: " + err)

    }
}

// get client by id
const deleteClientById = async (id, token) => {
    console.log("deleteClientById")
    try {
        let err, result;
        if (!token) {
            console.log('token is not exists')

            err = {
                code: 401,
                text: "please attach token."
            }
        } else {
            console.log('token is exists')
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

                    let client = await clientRepo.getClientById(id);
                    if (!client) {
                        err = {
                            code: 404,
                            text: `No clients with id: ${id}`
                        }
                    } else {
                        fs.unlinkSync(`img/${client.client_img}`)
                        fs.unlinkSync(`img/${client.face_national_id_img}`)
                        fs.unlinkSync(`img/${client.back_national_id_img}`)
                        await clientRepo.deleteClientById(id);
                        result = `client "${client.client_name}" 's been deleted.`
                    }
                }
            }
        }
        return { result, err }
    } catch (err) {
        console.log("clientController deleteClientById error: " + err)
    }

}





// this object is responsible for exporting functions of this file to other files
const processController = {
    createNewProcess,
    getAllClients,
    getClientById,
    deleteClientById,
    updateClient,
    updateclientImage,
    updateClientNationalImages
}


module.exports = { processController }
