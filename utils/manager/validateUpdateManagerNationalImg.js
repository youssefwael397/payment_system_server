const { managerRepo } = require("../../repos/managerRepo");
const fs = require('fs')

const validateUpdateManagerNationalImg = async (id, imgs) => {

  const face_national_id_img = imgs[0]
  const back_national_id_img = imgs[1]
  if (!face_national_id_img || !back_national_id_img) {
    const err = {
      code: 403,
      text: "Please Attach image.",
    };
    return { err };
  }
  
  if (!id) {
    const err = {
      code: 403,
      text: "All inputs are required.",
    };
    fs.unlinkSync(face_national_id_img.path)
    fs.unlinkSync(back_national_id_img.path)
    return { err };
  }

  const idPattern = /^\d*$/;
  const numberValid = idPattern.test(id);

  if (!numberValid) {
    const err = {
      code: 403,
      text: "Please Insert valid manager id",
    };
    fs.unlinkSync(face_national_id_img.path);
    fs.unlinkSync(back_national_id_img.path);
    return { err };
  }

  const exist_manager = await managerRepo.getManagerById(id);
  if (!exist_manager) {
    const err = {
      code: 409,
      text: `No Manager with id: ${id}`,
    };
    fs.unlinkSync(face_national_id_img.path)
    fs.unlinkSync(back_national_id_img.path)
    return { err };
  }

  fs.unlinkSync(`img/${exist_manager.face_national_id_img}`);
  fs.unlinkSync(`img/${exist_manager.back_national_id_img}`);
  
  const manager_data = {
    manager_id: id,
    face_national_id_img: face_national_id_img.filename,
    back_national_id_img: back_national_id_img.filename,
  };
  return { manager_data };
};
module.exports = validateUpdateManagerNationalImg;
