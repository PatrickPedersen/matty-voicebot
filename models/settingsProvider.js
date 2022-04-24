const database = require('../util/database');
const Guild = require('./guild');
const FriendCode = require('./friendCode');

// noinspection JSUnresolvedFunction
class SettingsProvider {
    async init(bot) {
        this.bot = bot;

        Guild.hasMany(FriendCode, { as: 'friendCodes'})
        FriendCode.belongsTo(Guild, { foreignKey: 'guildId', as: 'guild'})

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
    }

    async setPrefix(guildId, prefix) {
        return Guild.findByPk(guildId)
            .then(result => {
                return result.update({
                    prefix: prefix
                })
            }).catch(err => this.bot.logger.error(err.stack))
    }

    async createFriendCode(guildId, userId, codeName, codeValue) {
        return FriendCode.create({
            user_id: userId,
            code_name: codeName,
            code_value: codeValue,
            guildId: guildId
        })
        .then((friendCode => {
            console.log(">> Created FriendCode: " + JSON.stringify(friendCode, null, 4))
            return friendCode
        }))
        .catch(err => this.bot.logger.error(err.stack))
    }

    async fetchFriendCode(guildId, userId, codeName, all = false) {
        if (all === false) {
            return FriendCode.findOne({
                where: {
                    user_id: userId,
                    code_name: codeName,
                    guildId: guildId
                }
            }).catch(err => this.bot.logger.error(err.stack))
        } else {
            return FriendCode.findAll({
                where: {
                    user_id: userId,
                    guildId: guildId
                }
            }).catch(err => this.bot.logger.error(err.stack))
        }
    }

    async updateFriendCode(friendCodeId, codeValue) {
        await FriendCode.update({
            code_value: codeValue
        }, {
            where: {
                id: friendCodeId
            }
        }).catch(err => this.bot.logger.error(err.stack))
    }
}

module.exports = SettingsProvider;
