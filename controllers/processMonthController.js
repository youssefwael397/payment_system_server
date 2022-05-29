const { processMonthRepo } = require("../repos/processMonthRepo");

const processMonthCreator = async (new_process) => {
  let price_per_month = new_process.final_price / new_process.month_count;
  price_per_month = Math.round(price_per_month / 5) * 5;
  let process_month_date = new_process.first_date;

  for (let i = 0; i < new_process.month_count; i++) {
    process_month_date = process_month_date.split("/");
    let month = process_month_date[0];
    let year = process_month_date[1];
    month = +month;

    if (i > 0) {
      month = +month + 1;
    }

    if (month > 12) {
      month = 1;
      year = +year + 1;
    }
    process_month_date = `${month}/${year}`;

    const process_month = {
      process_id: new_process.process_id,
      price: price_per_month,
      date: process_month_date,
    };
    console.log(process_month);
    await processMonthRepo.createNewProcessMonth(process_month);
  }
};

// this object is responsible for exporting functions of this file to other files
const processMonthController = {
  processMonthCreator,
};

module.exports = { processMonthController };
