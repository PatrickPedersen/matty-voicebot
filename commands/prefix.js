const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prefix')
        .setDescription('Prefix commands'),

    async execute(bot, interaction, message, args) {
        let prefix = args[1]
        let response = await bot.settingsProvider.setPrefix(message.guildId, prefix)
        console.log(response)
        if (response) {
            message.channel.send(`Guild prefix updated to \`${prefix}\``)
        } else {
            message.channel.send('Could not update guild prefix')
        }
    }
}
