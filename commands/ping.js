const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    async execute(bot, interaction, message) {
        return interaction ? await interaction.reply('Pong!') : await message.channel.send('Pong!')
    }
}
