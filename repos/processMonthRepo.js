const {
  Process_Month,
  Process,
  Sales,
  Product,
  Sequelize,
} = require("../models/index");
const jwt = require("jsonwebtoken");
const op = Sequelize.Op;

// Create new process
const createNewProcessMonth = async (process) => {
  try {
    const new_process = await Process_Month.create(process);
    return new_process;
  } catch (error) {
    console.log("clientRepo createNewClient error: " + error);
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

const updateProcessMonth = async (id) => {
  let updated_process;
  try {
    const processMonth = await Process_Month.findOne({
      where: { process_month_id: id },
    });
    await Process_Month.update(
      {
        is_cashed: !processMonth.is_cashed,
      },
      {
        where: { process_month_id: id },
      }
    );
    updated_process = await Process_Month.findOne({
      where: { process_month_id: id },
    });
    return updated_process;
  } catch (error) {
    console.log("processMonthRepo updateProcessMonth error: " + error);
  }
};

const updateMonthPrice = async (id, price) => {
  let updated_process;
  try {
    await Process_Month.update(
      {
        price: price,
      },
      {
        where: { process_month_id: id },
      }
    );
    updated_process = await Process_Month.findOne({
      where: { process_month_id: id },
    });
    return updated_process;
  } catch (error) {
    console.log("processMonthRepo updateProcessMonth error: " + error);
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
const getClientById = async (id) => {
  try {
    const client = await Client.findOne({
      where: { client_id: id },
    });
    return client;
  } catch (error) {
    console.log("clientRepo getClientById error: " + error);
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
const getAllProcessesByMonth = async (month) => {
  try {
    const processes = await Process.findAll({
      include: [
        {
          model: Process_Month,
          where: { date: month },
          // include: [
          //   {
          //     model: Sales,
          //   },
          //   {
          //     model: Client,
          //   },
          //   {
          //     model: Product,
          //   },
          // ],
        },
      ],
    });
    console.log(processes);
    return processes;
  } catch (error) {
    console.log("clientRepo createNewClient error: " + error);
  }
};

const deleteProcessMonthById = async (id) => {
  try {
    const delete_process = await Process_Month.destroy({
      where: { process_id: id },
    });
    return delete_process;
  } catch (error) {
    console.log("processMonthRepo deleteProcessMonthById error: " + error);
  }
};

// this object is responsible for exporting functions of this file to other files
const processMonthRepo = {
  createNewProcessMonth,
  checkIfProcessExists,
  getAllClients,
  getClientById,
  getClientsBySalesId,
  deleteClientById,
  updateClient,
  updateClientImage,
  updateClientNationalImages,
  getAllProcessesMonthByProcessId,
  updateProcessMonth,
  deleteProcessMonthById,
  getAllProcessesByMonth,
  updateMonthPrice,
};

module.exports = { processMonthRepo };
