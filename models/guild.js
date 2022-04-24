const Sequelize = require('sequelize');
const database = require('../util/database');

const Guild = database.define('guild', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    prefix: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '!'
    },
    log: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    log_channel: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

module.exports = Guild;
