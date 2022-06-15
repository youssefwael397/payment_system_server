const { branchRepo } = require("../../repos/branchRepo");
const { managerRepo } = require("../../repos/managerRepo");
const { salesRepo } = require("../../repos/salesRepo");
const validateNumber = require("../validateNumber");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const validateCreateBranch = async (sales, images) => {
  const {
    sales_name,
    email,
    password,
    facebook_link,
    branch_id,
    manager_id,
    national_id,
    phone,
  } = sales;

  const sales_img = images[0];
  const face_national_id_img = images[1];
  const back_national_id_img = images[2];

  if (!sales_img || !face_national_id_img || !back_national_id_img) {
    const err = {
      code: 404,
      text: "من فضلك ادخل الصور المطلوبة",
    };
    return { err };
  }

  if (
    !branch_id ||
    !manager_id ||
    !sales_name ||
    !email ||
    !password ||
    !national_id ||
    !phone ||
    !facebook_link
  ) {
    const err = {
      code: 404,
      text: "كل الحقول مطلوبة",
    };
    fs.unlinkSync(sales_img.path);
    fs.unlinkSync(face_national_id_img.path);
    fs.unlinkSync(back_national_id_img.path);
    return { err };
  }

  const validateBranchId = validateNumber(branch_id);
  const validateManagerId = validateNumber(manager_id);
  const validateNationalId = validateNumber(national_id);
  const validatePhone = validateNumber(phone);

  if (validateBranchId.err || validateManagerId.err || validateNationalId.err) {
    const err = {
      code: 403,
      text: "Please Insert valid id",
    };
    fs.unlinkSync(sales_img.path);
    fs.unlinkSync(face_national_id_img.path);
    fs.unlinkSync(back_national_id_img.path);
    return { err };
  }

  if (validatePhone.err) {
    const err = {
      code: 403,
      text: "Please Insert valid phone number",
    };
    fs.unlinkSync(sales_img.path);
    fs.unlinkSync(face_national_id_img.path);
    fs.unlinkSync(back_national_id_img.path);
    return { err };
  }

  const salesExists = await salesRepo.checkIfSalesExists(sales);
  if (salesExists) {
    const err = {
      code: 409,
      text: "هذا المندوب موجود بالفعل",
    };
    fs.unlinkSync(sales_img.path);
    fs.unlinkSync(face_national_id_img.path);
    fs.unlinkSync(back_national_id_img.path);
    return { err };
  }

  const isManagerExist = await managerRepo.getManagerById(manager_id);
  if (!isManagerExist) {
    const err = {
      code: 400,
      text: `no manager with id : ${manager_id}`,
    };
    fs.unlinkSync(sales_img.path);
    fs.unlinkSync(face_national_id_img.path);
    fs.unlinkSync(back_national_id_img.path);
    return { err };
  }

  const isBranchExist = await branchRepo.getBranchById(branch_id);
  if (!isBranchExist) {
    const err = {
      code: 400,
      text: `no branch with id : ${branch_id}`,
    };
    fs.unlinkSync(sales_img.path);
    fs.unlinkSync(face_national_id_img.path);
    fs.unlinkSync(back_national_id_img.path);
    return { err };
  }

  const sales_data = {
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
    facebook_link: facebook_link,
    isLock: false
  };
  return { sales_data };
};
module.exports = validateCreateBranch;
