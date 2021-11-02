const { Collection } = require('discord.js')
const cooldowns = new Map()

module.exports = {
    name: 'interactionCreate',
    async execute(bot, interaction) {
        if (!interaction.isCommand()) return

        const command = bot.commands.get(interaction.commandName);

        if (!command) return

        if (!cooldowns.has(interaction.commandName)){
            cooldowns.set(interaction.commandName, new Collection())
        }

        const currentTime = Date.now()
        const timeStamps = cooldowns.get(interaction.commandName)
        const cooldownAmount = (command.cooldown) * 1000

        if (timeStamps.has(interaction.user.id)) {
            const expirationTime = timeStamps.get(interaction.user.id) + cooldownAmount

            if (currentTime < expirationTime) {
                const timeLeft = (expirationTime - currentTime) / 1000
                return interaction.reply(`Vent venligst ${timeLeft.toFixed(1)} sekunder før brug af ${interaction.commandName}`)
            }
        }

        timeStamps.set(interaction.user.id, currentTime)
        setTimeout(() => timeStamps.delete(interaction.user.id), cooldownAmount)

        try {
            await command.execute(interaction, bot)
        } catch (error) {
            console.error(error.stack)
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        }
    }
}
