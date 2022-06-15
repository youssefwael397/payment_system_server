const { managerRepo } = require("../../repos/managerRepo");
const { branchRepo } = require("../../repos/branchRepo");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const validateCreateManager = async (manager, images) => {
  let manager_img;
  let face_national_id_img;
  let back_national_id_img;

  images.map((image) => {
    console.log(image);
    if (image.fieldname === "manager_img") {
      manager_img = image;
    }

    if (image.fieldname === "manager_face_national_id_img") {
      face_national_id_img = image;
    }

    if (image.fieldname === "manager_back_national_id_img") {
      back_national_id_img = image;
    }
  });


  if (!(manager_img && face_national_id_img && back_national_id_img)) {
    const err = {
      code: 403,
      text: "من فضلك ادخل الصور المطلوبة",
    };
    return { err };
  }

  const {
    branch_id,
    manager_name,
    email,
    password,
    national_id,
    phone,
    facebook_link,
  } = manager;

  if (
    !(
      branch_id &&
      manager_name &&
      email &&
      password &&
      national_id &&
      phone &&
      facebook_link
    )
  ) {
    const err = {
      code: 403,
      text: "كل الحقول مطلوبة",
    };
    fs.unlinkSync(manager_img.path);
    fs.unlinkSync(face_national_id_img.path);
    fs.unlinkSync(back_national_id_img.path);
    return { err };
  }

  const idPattern = /^\d*$/;
  const numberValid = idPattern.test(branch_id);

  if (!numberValid) {
    const err = {
      code: 403,
      text: "Please Insert valid branch id",
    };
    fs.unlinkSync(manager_img.path);
    fs.unlinkSync(face_national_id_img.path);
    fs.unlinkSync(back_national_id_img.path);
    return { err };
  }

  const ExistBranch = await branchRepo.getBranchById(branch_id);
  if (!ExistBranch) {
    const err = {
      code: 409,
      text: `No Branch with id: ${branch_id}`,
    };
    fs.unlinkSync(manager_img.path);
    fs.unlinkSync(face_national_id_img.path);
    fs.unlinkSync(back_national_id_img.path);
    return { err };
  }

  const branchHasManager = await managerRepo.branchHasManager(branch_id);
  if (branchHasManager) {
    const err = {
      code: 409,
      text: `هذا الفرع يديره ${branchHasManager.manager_name} بالفعل`,
    };
    fs.unlinkSync(manager_img.path);
    fs.unlinkSync(face_national_id_img.path);
    fs.unlinkSync(back_national_id_img.path);
    return { err };
  }

  const ExistManager = await managerRepo.checkIfManagerExists(manager);
  if (ExistManager) {
    const err = {
      code: 409,
      text: "هذا المدير موجود بالفعل",
    };
    fs.unlinkSync(manager_img.path);
    fs.unlinkSync(face_national_id_img.path);
    fs.unlinkSync(back_national_id_img.path);
    return { err };
  }

  const manager_data = {
    branch_id,
    manager_name,
    email,
    password: bcrypt.hashSync(password, 10), // hashing password to save it to db
    national_id,
    phone,
    facebook_link,
    manager_img: manager_img.filename,
    face_national_id_img: face_national_id_img.filename,
    back_national_id_img: back_national_id_img.filename,
    isLock: false,
  };
  return { manager_data };
};
module.exports = validateCreateManager;
