const Sequelize = require('sequelize');
const database = require('../util/database');

const FriendCode = database.define('friendcodes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    code_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    code_value: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = FriendCode;