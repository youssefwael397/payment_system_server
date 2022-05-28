const { Client, Sales, Sequelize } = require('../models/index')
const jwt = require('jsonwebtoken');
const op = Sequelize.Op;

// Create new client 
const createNewClient = async (client) => {
    try {
        const new_client = await Client.create(client);
        return new_client
    } catch (error) {
        console.log("clientRepo createNewClient error: " + error)
    }
}


// update client info
const updateClient = async (client_id, {client_name, email, national_id, phone, facebook_link}) => {
    let updated_client;
    try {
        await Client.update(
            {
                client_name, email, national_id, phone, facebook_link
            },
            {
                where: { client_id: client_id }
            }
        );
        updated_client = await Client.findOne({ where: { client_id: client_id } })
        return updated_client

    } catch (error) {
        console.log("clientRepo updateClient error: " + error)
    }
}


// update client logo img
const updateClientImage = async (client_id, image) => {
    try {
        await Client.update(
            {
                client_img: image
            },
            {
                where: { client_id: client_id }
            }
        );
        let updated_client = await Client.findOne({ where: { client_id: client_id } })
        return updated_client

    } catch (error) {
        console.log("clientRepo updateClientImage error: " + error)
    }
}



// update client national imgs
const updateClientNationalImages = async (id, face_national_id_img, back_national_id_img) => {
    try {
        await Client.update(
            {
                face_national_id_img: face_national_id_img,
                back_national_id_img: back_national_id_img
            },
            {
                where: { client_id: id }
            }
        );
        let updated_client = await Client.findOne({ where: { client_id: id } })
        return updated_client

    } catch (error) {
        console.log("clientRepo updateclientNationalImages error: " + error)
    }
}


// get all client
const getAllClients = async () => {
    try {
        const clients = await Client.findAll();
        return clients
    } catch (error) {
        console.log("clientRepo getAllClients error: " + error)
    }
}

// get client by id
const getClientById = async (id) => {
    try {
        const client = await Client.findOne({
            where: { client_id: id },
        });
        return client
    } catch (error) {
        console.log("clientRepo getClientById error: " + error)
    }
}

// get client by id
const getClientsBySalesId = async (id) => {
    try {
        const client = await Client.findOne({
            where: { sales_id: id },
            include: {
                model: Sales
            }
        });
        return client
    } catch (error) {
        console.log("clientRepo getClientById error: " + error)
    }
}



// get client by id
const deleteClientById = async (id) => {
    try {
        const client = await Client.destroy({ where: { client_id: id } });
        return client
    } catch (error) {
        console.log("clientRepo deleteClientById error: " + error)
    }
}

const checkIfClientExists = async (client) => {
    const exist_client = await Client.findOne({
        where: {
            client_name: client.client_name,
            sales_id: client.sales_id,
            national_id: client.national_id,
        },
    });

    if (exist_client) {
        return true
    } else {
        return false
    }

}

// this object is responsible for exporting functions of this file to other files
const clientRepo = {
    createNewClient,
    checkIfClientExists,
    getAllClients,
    getClientById,
    getClientsBySalesId,
    deleteClientById,
    updateClient,
    updateClientImage,
    updateClientNationalImages
}


module.exports = { clientRepo }
