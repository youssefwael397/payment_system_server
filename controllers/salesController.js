const { salesRepo } = require("../repos/salesRepo");
const fs = require("fs");
const fsAsync = require("fs").promises;
const bcrypt = require("bcryptjs");
const { branchRepo } = require("../repos/branchRepo");
const { managerRepo } = require("../repos/managerRepo");
const validateCreateSales = require("../utils/sales/validateCreateSales");
const validateUpdateSales = require("../utils/sales/validateUpdateSales");
const validateNumber = require("../utils/validateNumber");

// Create new sales
const createNewSales = async (sales, images) => {
  try {
    const { sales_data, err } = await validateCreateSales(sales, images);
    if (err) return { err };

    const new_sales = await salesRepo.createNewSales(sales_data);
    return { new_sales };
  } catch (error) {
    console.log("salesController createNewSales error: " + error);
  }
};

// update sales
const updateSales = async (id, sales) => {
  try {
    const { sales_data, err } = await validateUpdateSales(id, sales);
    if (err) return { err };
    const update_sales = await salesRepo.updateSales(sales_data);
    return { update_sales };
  } catch (error) {
    console.log("salesController updateSales error: " + error);
  }
};

// get all sales
const getAllSales = async () => {
  try {
    let sales;
    sales = await salesRepo.getAllSales();
    let promises = [];
    sales.forEach((sales) => {
      promises.push(
        new Promise(async (resolve, reject) => {
          const img = await fsAsync.readFile(`img/${sales.sales_img}`, {
            encoding: "base64",
          });
          const branch_img = await fsAsync.readFile(
            `img/${sales.Branch.logo}`,
            { encoding: "base64" }
          );
          const face_national_id_img = await fsAsync.readFile(
            `img/${sales.face_national_id_img}`,
            { encoding: "base64" }
          );
          const back_national_id_img = await fsAsync.readFile(
            `img/${sales.back_national_id_img}`,
            { encoding: "base64" }
          );
          sales.sales_img = img;
          sales.Branch.logo = branch_img;
          sales.face_national_id_img = face_national_id_img;
          sales.back_national_id_img = back_national_id_img;
          resolve();
        })
      );
    });
    await Promise.all(promises);
    return { sales };
  } catch (err) {
    console.log("salesController getAllSales error: " + err);
  }
};

// get all sales
const getAllSalesByBranchId = async (id) => {
  try {
    const isBranchExist = await branchRepo.getBranchById(id);
    if (!isBranchExist) {
      const err = {
        code: 400,
        text: `no branch with id : ${id}`,
      };
      return { err };
    }

    const sales = await salesRepo.getAllSalesByBranchId(id);
    let promises = [];
    sales.forEach((sales) => {
      promises.push(
        new Promise(async (resolve, reject) => {
          const img = await fsAsync.readFile(`img/${sales.sales_img}`, {
            encoding: "base64",
          });
          const branch_img = await fsAsync.readFile(
            `img/${sales.Branch.logo}`,
            { encoding: "base64" }
          );
          const face_national_id_img = await fsAsync.readFile(
            `img/${sales.face_national_id_img}`,
            { encoding: "base64" }
          );
          const back_national_id_img = await fsAsync.readFile(
            `img/${sales.back_national_id_img}`,
            { encoding: "base64" }
          );
          sales.sales_img = img;
          sales.Branch.logo = branch_img;
          sales.face_national_id_img = face_national_id_img;
          sales.back_national_id_img = back_national_id_img;
          resolve();
        })
      );
    });
    await Promise.all(promises);
    return { sales };
  } catch (err) {
    console.log("salesController getAllSales error: " + err);
  }
};

// get sales by id
const getSalesById = async (id) => {
  try {
    let err, sales;
    const validateId = validateNumber(id);

    if (validateId.err) {
      err = validateId.err;
      return { err };
    }

    sales = await salesRepo.getSalesById(id);
    if (!sales) {
      err = {
        code: 404,
        text: `No sales with id: ${id}`,
      };
      return { err };
    }

    const img = await fsAsync.readFile(`img/${sales.sales_img}`, {
      encoding: "base64",
    });
    const branch_img = await fsAsync.readFile(`img/${sales.Branch.logo}`, {
      encoding: "base64",
    });
    const face_national_id_img = await fsAsync.readFile(
      `img/${sales.face_national_id_img}`,
      { encoding: "base64" }
    );
    const back_national_id_img = await fsAsync.readFile(
      `img/${sales.back_national_id_img}`,
      { encoding: "base64" }
    );
    sales.sales_img = img;
    sales.Branch.logo = branch_img;
    sales.face_national_id_img = face_national_id_img;
    sales.back_national_id_img = back_national_id_img;

    return { sales };
  } catch (err) {
    console.log("salesController getSalesById error: " + err);
  }
};

const updateSalesImage = async (id, sales_img) => {
  try {
    let success, err;
    if (!sales_img) {
      err = {
        code: 404,
        text: "Please Attach sales image.",
      };
      return { err };
    }

    const existSales = await salesRepo.getSalesById(id);
    if (!existSales) {
      err = {
        code: 404,
        text: `No sales with id: ${id}`,
      };
      fs.unlinkSync(sales_img.path);
      return { err };
    }

    console.log(existSales);
    await salesRepo.updateSalesImage(id, sales_img.filename);

    fs.unlinkSync(`img/${existSales.sales_img}`);
    success = `sales image updated successfully`;
    return { success };
  } catch (error) {
    console.log("salesController updateSalesImage error: " + err);
  }
};

const updateSalesNationalImages = async (manager_id, images) => {
  try {
    const face_national_id_img = images[0];
    const back_national_id_img = images[1];
    if (!face_national_id_img || !back_national_id_img) {
      const err = {
        code: 404,
        text: "Please Attach national-id images.",
      };
      return { err };
    }

    const existSales = await salesRepo.getSalesById(manager_id);
    if (!existSales) {
      const err = {
        code: 404,
        text: `No sales with id: ${manager_id}`,
      };
      fs.unlinkSync(`img/${existSales.face_national_id_img}`);
      fs.unlinkSync(`img/${existSales.back_national_id_img}`);
      return { err };
    }
    await salesRepo.updateSalesNationalImages(
      manager_id,
      face_national_id_img.filename,
      back_national_id_img.filename
    );
    fs.unlinkSync(`img/${existSales.face_national_id_img}`);
    fs.unlinkSync(`img/${existSales.back_national_id_img}`);
    const success = `sales national-id images updated successfully`;

    return { success };
  } catch (error) {
    console.log("salesController updateSalesNationalImages error: " + err);
  }
};

// get sales by id
const deleteSalesById = async (id) => {
  try {
    let err, result;
    let sales = await salesRepo.getSalesById(id);
    if (!sales) {
      err = {
        code: 404,
        text: `No sales with id: ${id}`,
      };
      return { err };
    }
    fs.unlinkSync(`img/${sales.sales_img}`);
    fs.unlinkSync(`img/${sales.face_national_id_img}`);
    fs.unlinkSync(`img/${sales.back_national_id_img}`);
    await salesRepo.deleteSalesById(id);
    result = `sales "${sales.sales_name}" 's been deleted.`;
    return { result };
  } catch (err) {
    console.log("salesController deleteSalesById error: " + err);
  }
};

// this object is responsible for exporting functions of this file to other files
const salesController = {
  createNewSales,
  getAllSales,
  getAllSalesByBranchId,
  getSalesById,
  deleteSalesById,
  updateSales,
  updateSalesImage,
  updateSalesNationalImages,
};

module.exports = { salesController };
