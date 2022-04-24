const { Client, Collection, Intents } = require('discord.js')
const winston = require('winston')
const SettingsProvider = require('./models/settingsProvider')
const settings = require('./settings.json')
const fs = require('fs')

if (settings.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES],
    presence: {
        activities: [{
            name: 'https://discord.gg/7CSpQap9wj',
            type: "PLAYING"
        }],
        status: 'online'
    }
})

bot.channelNumber = 1
bot.cooldowns = new Map()

bot.logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'XCS_bot.log' })
    ],
    format: winston.format.printf((log) => `[${new Date().toLocaleString()}] - [${log.level.toUpperCase()}] - ${log.message}`)
});

if (settings.NODE_ENV !== 'production') {
    bot.logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

bot.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    bot.commands.set(command.data.name, command)
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.once) {
        bot.once(event.name, (...args) => event.execute(bot, ...args))
    } else {
        bot.on(event.name, (...args) => event.execute(bot, ...args))
    }
}

bot.login(process.env.TOKEN)
    .catch(err => console.error(err.stack))

bot.settingsProvider = new SettingsProvider()
