const createProcess = (req, res, next) => {
    const {
        client_id,
        product_id,
        first_price,
        month_count,
        percent,
        first_date,
        second_date,
        product_price,
        product_price_after_percent,
        discount,
        final_price
    } = req.body;

    console.log(req.body)

    // validate if user doesn't insert all inputs
    if (!(client_id &&
        product_id &&
        first_price &&
        month_count &&
        percent &&
        first_date &&
        second_date &&
        product_price &&
        product_price_after_percent &&
        discount &&
        final_price)) {
        return res.status(422).send({ status: 'error', error: "All inputs are required." });
    }

    // go to the next middleware
    return next();
};

module.exports = createProcess;