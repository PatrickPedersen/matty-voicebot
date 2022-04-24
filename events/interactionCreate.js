const { Collection } = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    async execute(bot, interaction) {
        const message = false

        if (!interaction.isCommand()) return
        const command = bot.commands.get(interaction.commandName);
        if (!command) return

        if (command.cooldown) {
            if (!bot.cooldowns.has(interaction.commandName)){
                bot.cooldowns.set(interaction.commandName, new Collection())
            }

            const currentTime = Date.now()
            const timeStamps = bot.cooldowns.get(interaction.commandName)
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
        }

        try {
            await command.execute(bot, interaction, message)
        } catch (error) {
            console.error(error.stack)
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        }
    }
}
