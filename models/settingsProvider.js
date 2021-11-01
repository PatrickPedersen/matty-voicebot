const Sequelize = require('sequelize');
const database = require('../util/database');
const Guild = require('./guild');
const FriendCodes = require('./friendCodes');

// noinspection JSUnresolvedFunction
class SettingsProvider {
    async init(bot) {
        this.bot = bot;

        Guild.hasMany(FriendCodes);

        //database.sync({force: true}).catch(err => console.log(err))
        //database.sync().catch(err => console.log(err))

        try {
            await database.authenticate();
            this.bot.logger.info('Successfully connected to the DB');
        } catch (e) {
            this.bot.logger.error(e.stack);
            process.exit(-1);
        }


        for (const guild in this.bot.guilds.cache.map(guild => guild)) {
            try {
                const result = await Guild.findByPk(this.bot.guilds.cache.map(guild => guild)[guild].id)

                if (!result) {
                    // Insert guild into guild table
                    await Guild.create({id: this.bot.guilds.cache.map(guild => guild)[guild].id})
                }
            } catch (e) {
                this.bot.logger.error(e.stack);
            }
        }
    }

    // Fetches id, prefix, log, log-channel
    async fetchGuild(guildId, key) {
        if (!key) {
            return Guild.findByPk(guildId)
                .catch(err => this.bot.logger.error(err.stack))
        } else {
            return Guild.findByPk(guildId)
                .then(result => result.getDataValue(key))
                .catch(err => this.bot.logger.error(err.stack))
        }
    };
}

module.exports = SettingsProvider;