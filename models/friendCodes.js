const Sequelize = require('sequelize');
const database = require('../util/database');

const FriendCodes = database.define('friendcodes', {
    code_id: {
        type: Sequelize.STRING,
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

module.exports = FriendCodes;