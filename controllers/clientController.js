const { clientRepo } = require("../repos/clientRepo");
const { salesRepo } = require("../repos/salesRepo");
const fs = require("fs");
const fsAsync = require("fs").promises;
const bcrypt = require("bcryptjs");
const { branchRepo } = require("../repos/branchRepo");
const { managerRepo } = require("../repos/managerRepo");

// Create new client
const createNewClient = async (client, images) => {
  try {
    let err, new_client;
    const face_national_id_img = images[0];
    const back_national_id_img = images[1];
    const {
      sales_id,
      client_name,
      national_id,
      phone,
      work,
      home_address,
      work_address,
      facebook_link,
    } = client;

    if (!face_national_id_img || !back_national_id_img) {
      err = {
        code: 404,
        text: "من فضلك ادخل الصور المطلوبة",
      };
      return { err };
    }

    if (
      !sales_id ||
      !client_name ||
      !national_id ||
      !phone ||
      !work ||
      !home_address ||
      !work_address ||
      !facebook_link
    ) {
      err = {
        code: 404,
        text: "كل الحقول مطلوبة",
      };
      face_national_id_img && fs.unlinkSync(face_national_id_img.path);
      back_national_id_img && fs.unlinkSync(back_national_id_img.path);
      return { err };
    }

    const client_data = {
      sales_id: sales_id,
      client_name: client_name,
      work: work,
      work_address: work_address,
      home_address: home_address,
      national_id: national_id,
      phone: phone,
      face_national_id_img: face_national_id_img.filename,
      back_national_id_img: back_national_id_img.filename,
      facebook_link: facebook_link,
    };

    const salesExist = await salesRepo.getSalesById(sales_id);
    if (!salesExist) {
      err = {
        code: 400,
        text: `There is no sales with id: ${sales_id}`,
      };
      face_national_id_img && fs.unlinkSync(face_national_id_img.path);
      back_national_id_img && fs.unlinkSync(back_national_id_img.path);
      return { err };
    }

    const duplicateClient = await clientRepo.checkIfClientExists(client);
    if (duplicateClient) {
      err = {
        code: 409,
        text: "هذا العميل موجود بالفعل",
      };
      face_national_id_img && fs.unlinkSync(face_national_id_img.path);
      back_national_id_img && fs.unlinkSync(back_national_id_img.path);
      return { err };
    }
    new_client = await clientRepo.createNewClient(client_data);
    return { new_client };
  } catch (error) {
    console.log("clientController createNewClient error: " + error);
  }
};

// update client
const updateClient = async (client_id, client) => {
  try {
    let err;
    const { client_name, email, national_id, phone, facebook_link } = client;

    if (!client_name || !email || !national_id || !phone || !facebook_link) {
      err = {
        code: 404,
        text: "All inputs are required.",
      };
      return { err };
    }

    const existClient = await clientRepo.getClientById(client_id);
    if (!existClient) {
      err = {
        code: 404,
        text: `No client with id: ${client_id}`,
      };
      return { err };
    }

    const update_client = await clientRepo.updateClient(client_id, client);
    return { update_client };
  } catch (error) {
    console.log("clientController updateClient error: " + error);
  }
};

const updateClientNationalImages = async (id, images) => {
  try {
    const face_national_id_img = images[0];
    const back_national_id_img = images[1];
    let success, err;

    if (!face_national_id_img || !face_national_id_img) {
      err = {
        code: 404,
        text: "Please Attach national-id images.",
      };

      return { err };
    }

    const existClient = await clientRepo.getClientById(id);
    if (!existClient) {
      err = {
        code: 404,
        text: `No clients with id: ${id}`,
      };
      face_national_id_img && fs.unlinkSync(`img/${face_national_id_img}`);
      back_national_id_img && fs.unlinkSync(`img/${back_national_id_img}`);
      return { err };
    }

    const updateClient = await clientRepo.updateClientNationalImages(
      id,
      face_national_id_img.filename,
      back_national_id_img.filename
    );

    if (updateClient) {
      fs.unlinkSync(`img/${existClient.face_national_id_img}`);
      fs.unlinkSync(`img/${existClient.back_national_id_img}`);
      success = `client ${existClient.client_name} national-id images updated successfully`;
      return { success };
    } else {
      face_national_id_img && fs.unlinkSync(face_national_id_img.filename);
      back_national_id_img && fs.unlinkSync(back_national_id_img.filename);
      err = {
        code: 404,
        text: `Failed to update national images to client with id : ${id}`,
      };
      return { err };
    }
  } catch (error) {
    console.log("clientController updateClientNationalImages error: " + err);
  }
};

// get all client
const getAllClients = async () => {
  try {
    let clients;
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
    return { clients };
  } catch (err) {
    console.log("clientController getAllClients error: " + err);
  }
};

// get client by id
const getClientsBySalesId = async (id) => {
  let err, clients;
  try {
    clients = await clientRepo.getClientsBySalesId(id);
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

    return { clients };
  } catch (err) {
    console.log("clientController getClientsBySalesId error: " + err);
  }
};

const getClientsByBranchId = async (id) => {
  let err, clients;
  try {
    clients = await clientRepo.getClientsByBranchId(id);
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

    return { clients };
  } catch (err) {
    console.log("clientController getClientsBySalesId error: " + err);
  }
};

const getClientById = async (id) => {
  let err, client;
  try {
    client = await clientRepo.getClientById(id);
    if (!client) {
      err = {
        code: 404,
        text: `No client with id: ${id}`,
      };
      return { err };
    }

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

    return { client };
  } catch (err) {
    console.log("clientController getClientById error: " + err);
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
const clientController = {
  createNewClient,
  getAllClients,
  getClientById,
  deleteClientById,
  updateClient,
  updateClientNationalImages,
  getClientsBySalesId,
  getClientsByBranchId
};

module.exports = { clientController };
