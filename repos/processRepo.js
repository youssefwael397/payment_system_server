const { Process, Sales, Client,Product, Sequelize } = require("../models/index");
const jwt = require("jsonwebtoken");
const op = Sequelize.Op;

// Create new process
const createNewProcess = async (process) => {
  try {
    const new_process = await Process.create(process);
    return new_process;
  } catch (error) {
    console.log("clientRepo createNewClient error: " + error);
  }
};

const getAllProcessesByClientId = async (client_id) => {
  try {
    const processes = await Process.findAll({ where: { client_id } });
    return processes;
  } catch (error) {
    console.log("clientRepo getAllClients error: " + error);
  }
};

const getAllProcessesBySalesId = async (sales_id) => {
  try {
    const processes = await Process.findAll({
      where: { sales_id },
      include: [{ model: Sales }, { model: Client } , { model: Product }],
    });
    return processes;
  } catch (error) {
    console.log("clientRepo getAllClients error: " + error);
  }
};

// update client info
const updateClient = async (
  client_id,
  client_name,
  email,
  national_id,
  phone,
  facebook_link
) => {
  let updated_client;
  try {
    await Client.update(
      {
        client_name,
        email,
        national_id,
        phone,
        facebook_link,
      },
      {
        where: { client_id: client_id },
      }
    );
    updated_client = await Client.findOne({ where: { client_id: client_id } });
    return updated_client;
  } catch (error) {
    console.log("clientRepo updateClient error: " + error);
  }
};

// update client logo img
const updateClientImage = async (client_id, image) => {
  try {
    await Client.update(
      {
        client_img: image,
      },
      {
        where: { client_id: client_id },
      }
    );
    let updated_client = await Client.findOne({
      where: { client_id: client_id },
    });
    return updated_client;
  } catch (error) {
    console.log("clientRepo updateClientImage error: " + error);
  }
};

// update client national imgs
const updateClientNationalImages = async (
  id,
  face_national_id_img,
  back_national_id_img
) => {
  try {
    await Client.update(
      {
        face_national_id_img: face_national_id_img,
        back_national_id_img: back_national_id_img,
      },
      {
        where: { client_id: id },
      }
    );
    let updated_client = await Client.findOne({ where: { client_id: id } });
    return updated_client;
  } catch (error) {
    console.log("clientRepo updateclientNationalImages error: " + error);
  }
};

// get all client
const getAllClients = async () => {
  try {
    const clients = await Client.findAll();
    return clients;
  } catch (error) {
    console.log("clientRepo getAllClients error: " + error);
  }
};

// get client by id
const getProcessById = async (id) => {
  try {
    const process = await Process.findOne({
      where: { process_id: id },
      include: [
        {
          model: Sales
        },
        {
          model: Client
        },
        {
          model: Product
        }
      ]
    });
    return process;
  } catch (error) {
    console.log("processRepo getprocessById error: " + error);
  }
};

// get client by id
const getClientsBySalesId = async (id) => {
  try {
    const client = await Client.findOne({
      where: { sales_id: id },
      include: {
        model: Sales,
      },
    });
    return client;
  } catch (error) {
    console.log("clientRepo getClientById error: " + error);
  }
};

// get client by id
const deleteClientById = async (id) => {
  try {
    const client = await Client.destroy({ where: { client_id: id } });
    return client;
  } catch (error) {
    console.log("clientRepo deleteClientById error: " + error);
  }
};

const checkIfProcessExists = async ({
  client_id,
  product_id,
  first_price,
  month_count,
  first_date,
  last_date,
  final_price,
}) => {
  const exist_client = await Process.findOne({
    where: {
      product_id,
      first_price,
      month_count,
      first_date,
      last_date,
      final_price,
    },
  });

  if (exist_client) {
    return true;
  } else {
    return false;
  }
};

const getAllProcessesMonthByProcessId = async (id) => {
  try {
    const new_process = await Process_Month.findAll({
      where: { process_id: id },
    });
    return new_process;
  } catch (error) {
    console.log("clientRepo createNewClient error: " + error);
  }
};

// this object is responsible for exporting functions of this file to other files
const processRepo = {
  createNewProcess,
  getAllProcessesByClientId,
  getAllProcessesBySalesId,
  checkIfProcessExists,
  getAllClients,
  getProcessById,
  getClientsBySalesId,
  deleteClientById,
  updateClient,
  updateClientImage,
  updateClientNationalImages,
  getAllProcessesMonthByProcessId,
};

module.exports = { processRepo };
