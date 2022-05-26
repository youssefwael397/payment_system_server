const { managerRepo } = require("../../repos/managerRepo");
const fs = require('fs')

const validateUpdateManagerImg = async (id, img) => {

  if (!img) {
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
    fs.unlinkSync(img.path)
    return { err };
  }

  
  const idPattern = /^\d*$/;
  const numberValid = idPattern.test(id);

  if (!numberValid) {
    const err = {
      code: 403,
      text: "Please Insert valid manager id",
    };
    fs.unlinkSync(img.path)
    return { err };
  }


  const exist_manager = await managerRepo.getManagerById(id);
  if (!exist_manager) {
    const err = {
      code: 409,
      text: `No Manager with id: ${id}`,
    };
    fs.unlinkSync(img.path)
    return { err };
  }

  fs.unlinkSync(`img/${exist_manager.manager_img}`);
  const manager_data = {
    manager_id: id,
    manager_img: img.filename,
  };
  return { manager_data };
};
module.exports = validateUpdateManagerImg;
