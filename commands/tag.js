const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tag')
        .setDescription('Sætter ens vennekoder (Main og Smurf)')
        .addStringOption(option => 
            option.setName('konto')
                .setDescription('description')
                .setRequired(true)
                .addChoice('Main','main')
                .addChoice('Smurf', 'smurf'))
        .addStringOption(option => 
            option.setName('kode')
                .setDescription('Skriv din vennekode')
                .setRequired(true)),

    async execute(interaction, bot) {
        await interaction.deferReply()

        await bot.settingsProvider.createFriendCode(interaction.guild.id, interaction.user.id, interaction.options.getString("konto"), interaction.options.getString('kode'))
            .catch(err => bot.logger.error(err.stack))

        let user = await bot.users.fetch(interaction.user.id)

        let embed = new MessageEmbed()
            .setAuthor(`${user.username}`, user.displayAvatarURL())
            .setDescription('Dine vennekoder')
            .addFields(
                { name: 'Main', value: '{Kode 1}'},
                { name: 'Smurf', value: '{Kode 2}'}
            )
            .setTimestamp()
            .setFooter(`${bot.user.username}`, `${bot.user.displayAvatarURL()}`)

        await interaction.editReply({ embeds: [embed] })
    }
}
