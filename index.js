const { sequelize, Sequelize } = require("./models/index");
const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const cors = require('cors');
const boss = require('./routes/bossRoute')
const login = require('./routes/loginRoute')
const branch = require('./routes/branchRoute')
const manager = require('./routes/managerRoute')
const category = require('./routes/categoryRoute')
const product = require('./routes/productRoute')

// try {
//     sequelize.sync({ force: true })
// } catch (error) {
//     console.log('error')
// }

try {

    // middleware
    app.use(express.json()); // built-in middleware for express
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/xwww-form-urlencoded
    app.use(cors());
    app.use('/boss', boss);
    app.use('/login', login);
    app.use('/branch', branch);
    app.use('/manager', manager);
    app.use('/category', category);
    app.use('/product', product);

} catch (error) {
    res.status(500).send({
        status: 'error',
        message: error
    })
}

// creating a server
app.listen(port, () => console.log(`server listening on port ${port}...`))
