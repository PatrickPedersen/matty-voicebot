const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('team')
        .setDescription('Vennekoder for alle i stemme kanalen'),

    async execute(interaction, bot) {
        await interaction.deferReply()

        let guild = await bot.guilds.fetch(interaction.guildId)

        let embed = new MessageEmbed()
            .setAuthor(`${guild.name}`, guild.iconURL())
            .setDescription('Vennekoder for alle spillere i kanal: {KanalNavn}')
            .addFields(
                { name: '{Spiller 1}', value: '{Kode 1}'},
                { name: '{Spiller 2}', value: '{Kode 2}'},
                { name: '{Spiller 3}', value: '{Kode 3}'},
                { name: '{Spiller 4}', value: '{Kode 4}'},
                { name: '{Spiller 5}', value: '{Kode 5}'}
            )
            .setTimestamp()
            .setFooter(`${bot.user.username}`, `${bot.user.displayAvatarURL()}`)
        
        await interaction.editReply({ embeds: [embed] })
    }
}
