const { Sequelize } = require('sequelize');
const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = require('../settings.json')

const database = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mariadb",
    define: {
        timestamps: false
    }
})

module.exports = database;