const { Collection } = require('discord.js')

module.exports = {
    name: 'messageCreate',
    async execute(bot, message) {
        const interaction = false

        let prefix = await bot.settingsProvider.fetchGuild(message.guildId, 'prefix')

        let args = message.content.trim().split(' ').map(arg => arg.toLowerCase())
        if (!args[0].startsWith(prefix) || message.author.bot) return;

        const cmd = args[0].slice(prefix.length).toLowerCase()
        const command = bot.commands.get(cmd);
        if (!command) return

        if (command.cooldown) {
            if (!bot.cooldowns.has(command.data.name)){
                bot.cooldowns.set(command.data.name, new Collection())
            }

            const currentTime = Date.now()
            const timeStamps = bot.cooldowns.get(command.data.name)
            const cooldownAmount = (command.cooldown) * 1000

            if (timeStamps.has(message.author.id)) {
                const expirationTime = timeStamps.get(message.author.id) + cooldownAmount

                if (currentTime < expirationTime) {
                    const timeLeft = (expirationTime - currentTime) / 1000
                    return message.channel.send(`Command is on cooldown for ${timeLeft.toFixed(1)}`)
                }
            }

            timeStamps.set(message.author.id, currentTime)
            setTimeout(() => timeStamps.delete(message.author.id), cooldownAmount)
        }

        try {
            await command.execute(bot, interaction, message, args)
        } catch (error) {
            console.error(error.stack)
            await message.channel.send('There was an error while executing this command!')
        }
    }
}
