const { managerRepo } = require("../repos/managerRepo");
const validateCreateManager = require("../utils/manager/validateCreateManager");
const validateUpdateManager = require("../utils/manager/validateUpdateManager");
const validateUpdateManagerImg = require("../utils/manager/validateUpdateManagerImg");
const validateUpdateManagerNationalImg = require("../utils/manager/validateUpdateManagerNationalImg");
const fs = require("fs");
const fsAsync = require("fs").promises;
const bcrypt = require("bcryptjs");
const { branchRepo } = require("../repos/branchRepo");

// Create new manager
const createNewManager = async (manager, images) => {
  let err, new_manager;
  try {
    const { manager_data, err } = await validateCreateManager(manager, images);
    if (err) {
      return { err };
    }
    const new_manager = await managerRepo.createNewManager(manager_data);
    return { new_manager };
  } catch (error) {
    console.log("managerController createNewManager error: " + error);
  }

  return { new_manager, err };
};

// update manager
const updateManager = async (id, manager) => {
  try {
    const { manager_data, err } = await validateUpdateManager(id, manager);
    if (err) return { err };

    const update_manager = await managerRepo.updateManager(manager_data);
    return { update_manager };
  } catch (error) {
    console.log("managerController updateManager error: " + error);
  }

  return { manager, err };
};

const updateManagerImage = async (id, manager_img) => {
  try {
    const { manager_data, err } = await validateUpdateManagerImg(
      id,
      manager_img
    );
    if (err) return { err };
    const updateManager = await managerRepo.updateMangerImage(manager_data);
    const success = `manager image 's been updated successfully.`;
    return { success };
  } catch (error) {
    console.log("managerController updateManagerImage error: " + error);
  }
};

const updateManagerNationalImages = async (id, images) => {
  try {
    const { manager_data, err } = await validateUpdateManagerNationalImg(
      id,
      images
    );
    if (err) return { err };
    const updateManager = await managerRepo.updateManagerNationalImages(
      manager_data
    );
    const success = `manager national-id images updated successfully`;
    return { success };
  } catch (error) {
    console.log(
      "managerController updateManagerNationalImages error: " + error
    );
  }
};

// get all managers
const getAllManagers = async () => {
  try {
    const managers = await managerRepo.getAllManagers();
    let promises = [];
    managers.forEach((manager) => {
      promises.push(
        new Promise(async (resolve, reject) => {
          const img = await fsAsync.readFile(`img/${manager.manager_img}`, {
            encoding: "base64",
          });
          const branch_img = await fsAsync.readFile(
            `img/${manager.Branch.logo}`,
            { encoding: "base64" }
          );
          const face_national_id_img = await fsAsync.readFile(
            `img/${manager.face_national_id_img}`,
            { encoding: "base64" }
          );
          const back_national_id_img = await fsAsync.readFile(
            `img/${manager.back_national_id_img}`,
            { encoding: "base64" }
          );
          manager.manager_img = img;
          manager.Branch.logo = branch_img;
          manager.face_national_id_img = face_national_id_img;
          manager.back_national_id_img = back_national_id_img;
          resolve();
        })
      );
    });
    await Promise.all(promises);
    return { managers };
  } catch (err) {
    console.log("managerController getAllManagers error: " + err);
  }
};

// get manager by id
const getManagerById = async (id) => {
  try {
    const idPattern = /^\d*$/;
    const numberValid = idPattern.test(id);

    if (!numberValid) {
      const err = {
        code: 403,
        text: "Please Insert valid manager id",
      };
      return { err };
    }

    const manager = await managerRepo.getManagerById(id);
    if (!manager) {
      const err = {
        code: 404,
        text: `No managers with id: ${id}`,
      };
      return { err };
    }

    const img = await fsAsync.readFile(`img/${manager.manager_img}`, {
      encoding: "base64",
    });
    const branch_img = await fsAsync.readFile(`img/${manager.Branch.logo}`, {
      encoding: "base64",
    });
    const face_national_id_img = await fsAsync.readFile(
      `img/${manager.face_national_id_img}`,
      { encoding: "base64" }
    );
    const back_national_id_img = await fsAsync.readFile(
      `img/${manager.back_national_id_img}`,
      { encoding: "base64" }
    );
    manager.manager_img = img;
    manager.Branch.logo = branch_img;
    manager.face_national_id_img = face_national_id_img;
    manager.back_national_id_img = back_national_id_img;

    return { manager };
  } catch (err) {
    console.log("managerController getManagerById error: " + err);
  }
};

// get manager by id
const deleteManagerById = async (id) => {
  try {
    const idPattern = /^\d*$/;
    const numberValid = idPattern.test(id);

    if (!numberValid) {
      const err = {
        code: 403,
        text: "Please Insert valid manager id",
      };
      return { err };
    }

    const manager = await managerRepo.getManagerById(id);
    if (!manager) {
      const err = {
        code: 404,
        text: `No managers with id: ${id}`,
      };
      return { err };
    }
    fs.unlinkSync(`img/${manager.manager_img}`);
    fs.unlinkSync(`img/${manager.face_national_id_img}`);
    fs.unlinkSync(`img/${manager.back_national_id_img}`);
    await managerRepo.deleteManagerById(id);
    result = `manager "${manager.manager_name}" 's been deleted.`;

    return { result };
  } catch (err) {
    console.log("managerController deleteManagerById error: " + err);
  }
};

// this object is responsible for exporting functions of this file to other files
const managerController = {
  createNewManager,
  getAllManagers,
  getManagerById,
  deleteManagerById,
  updateManager,
  updateManagerImage,
  updateManagerNationalImages,
};

module.exports = { managerController };
