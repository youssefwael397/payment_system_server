const { clientRepo } = require("../repos/clientRepo");
const { processRepo } = require("../repos/processRepo");
const { salesRepo } = require("../repos/salesRepo");
const { processMonthController } = require("./processMonthController");

const fs = require("fs");
const fsAsync = require("fs").promises;
const bcrypt = require("bcryptjs");

// Create new process
const createNewProcess = async (process) => {
  try {
    const {
      client_id,
      product_id,
      first_price,
      month_count,
      first_date,
      last_date,
      final_price,
    } = process;

    // validate if user doesn't insert all inputs
    if (
      !(
        client_id &&
        product_id &&
        first_price &&
        month_count &&
        first_date &&
        last_date &&
        final_price
      )
    ) {
      const err = {
        code: 422,
        text: "All inputs are required.",
      };
      return { err };
    }

    const existProcess = await processRepo.checkIfProcessExists(process);
    if (existProcess) {
      const err = {
        code: 422,
        text: "This Process is already exists",
      };
      return { err };
    }
    const new_process = await processRepo.createNewProcess(process);

    await processMonthController.processMonthCreator(new_process);
    return { new_process };
  } catch (error) {
    console.log("processController createNewProcess error: " + error);
  }
};

const getAllProcessesByClientId = async (id) => {
  let processes;
  try {
    processes = await processRepo.getAllProcessesByClientId(id);
    return { processes };
  } catch (err) {
    console.log("clientController getAllClients error: " + err);
  }
};

const getAllProcessesBySalesId = async (id) => {
  let processes;
  try {
    const salesExist = await salesRepo.getSalesById(id);
    if (!salesExist) {
      const err = {
        code: 403,
        text: `There is no sales with id: ${id}`,
      };
      return { err };
    }
    processes = await processRepo.getAllProcessesBySalesId(id);
    return { processes };
  } catch (err) {
    console.log("clientController getAllClients error: " + err);
  }
};

const getAllProcessesMonthByProcessId = async (id) => {
  let processes;
  try {
    processes = await processRepo.getAllProcessesMonthByProcessId(id);
    return { processes };
  } catch (err) {
    console.log("clientController getAllClients error: " + err);
  }
};

// update client
const updateClient = async (
  client_id,
  client_name,
  email,
  national_id,
  phone,
  facebook_link,
  token
) => {
  let err, client;
  if (!token) {
    err = {
      code: 401,
      text: "please attach token.",
    };
  } else {
    const isValid = tokenValidate.isVerify(token);
    if (!isValid) {
      err = {
        code: 401,
        text: "Invalid token",
      };
    } else {
      const isManager = tokenValidate.isManager(token);
      if (!isManager) {
        err = {
          code: 403,
          text: "You have no permissions to update client.",
        };
      } else {
        if (
          !client_name ||
          !email ||
          !national_id ||
          !phone ||
          !facebook_link
        ) {
          err = {
            code: 404,
            text: "Please Insert All information what we need.",
          };
        } else {
          try {
            const existClient = await clientRepo.getClientById(client_id);
            if (!existClient) {
              err = {
                code: 404,
                text: `No client with id: ${client_id}`,
              };
            } else {
              client = await clientRepo.updateClient(
                client_id,
                client_name,
                email,
                national_id,
                phone,
                facebook_link
              );
            }
          } catch (error) {
            console.log("clientController updateClient error: " + error);
          }
        }
      }
    }
  }
  return { client, err };
};

// get all client
const getAllClients = async (token) => {
  let err, clients;
  try {
    if (!token) {
      err = {
        code: 401,
        text: "please attach token.",
      };
    } else {
      const isValid = tokenValidate.isVerify(token);
      if (!isValid) {
        err = {
          code: 401,
          text: "Invalid token",
        };
      } else {
        const isSales = tokenValidate.isSales(token);
        if (!isSales) {
          err = {
            code: 403,
            text: "You have no permissions to update client.",
          };
        } else {
          clients = await clientRepo.getAllClients();
          let promises = [];
          clients.forEach((client) => {
            promises.push(
              new Promise(async (resolve, reject) => {
                const face_national_id_img = await fsAsync.readFile(
                  `img/${client.face_national_id_img}`,
                  { encoding: "base64" }
                );
                const back_national_id_img = await fsAsync.readFile(
                  `img/${client.back_national_id_img}`,
                  { encoding: "base64" }
                );
                client.face_national_id_img = face_national_id_img;
                client.back_national_id_img = back_national_id_img;
                resolve();
              })
            );
          });
          await Promise.all(promises);
        }
      }
    }
  } catch (err) {
    console.log("clientController getAllClients error: " + err);
  }
  return { clients, err };
};

// get client by id
const getProcessById = async (id) => {
  let err, process;
  try {
    process = await processRepo.getProcessById(id);
    if (!process) {
      err = {
        code: 404,
        text: `No process with id: ${id}`,
      };
    }

    return { process, err };
  } catch (err) {
    console.log("processController getClientById error: " + err);
  }
};

// get client by id
const deleteClientById = async (id, token) => {
  console.log("deleteClientById");
  try {
    let err, result;
    if (!token) {
      console.log("token is not exists");

      err = {
        code: 401,
        text: "please attach token.",
      };
    } else {
      console.log("token is exists");
      const isVerify = tokenValidate.isVerify(token);
      if (!isVerify) {
        err = {
          code: 401,
          text: "Invalid token",
        };
      } else {
        const isBoss = tokenValidate.isBoss(token);
        if (!isBoss) {
          err = {
            code: 403,
            text: "You have no permissions to delete clients.",
          };
        } else {
          console.log("isBoss");

          let client = await clientRepo.getClientById(id);
          if (!client) {
            err = {
              code: 404,
              text: `No clients with id: ${id}`,
            };
          } else {
            fs.unlinkSync(`img/${client.client_img}`);
            fs.unlinkSync(`img/${client.face_national_id_img}`);
            fs.unlinkSync(`img/${client.back_national_id_img}`);
            await clientRepo.deleteClientById(id);
            result = `client "${client.client_name}" 's been deleted.`;
          }
        }
      }
    }
    return { result, err };
  } catch (err) {
    console.log("clientController deleteClientById error: " + err);
  }
};

// this object is responsible for exporting functions of this file to other files
const processController = {
  createNewProcess,
  getAllProcessesByClientId,
  getAllProcessesBySalesId,
  getAllClients,
  getProcessById,
  deleteClientById,
  updateClient,
  getAllProcessesMonthByProcessId,
};

module.exports = { processController };
