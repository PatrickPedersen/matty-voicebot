const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    cooldown: 10,
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

        const account = interaction.options.getString('konto');
        const code = interaction.options.getString('kode')

        const codes_if_exist = await bot.settingsProvider.fetchFriendCode(interaction.guild.id, interaction.user.id, account)

        if (codes_if_exist) {
            const data = codes_if_exist.dataValues
            if (data.code_name !== account) return await interaction.editReply({ content: "Encountered an error, please contact staff." })
            await bot.settingsProvider.updateFriendCode(data.id, code)
        } else {
            await bot.settingsProvider.createFriendCode(interaction.guild.id, interaction.user.id, account, code)
                .catch(err => bot.logger.error(err.stack))
        }

        let user = await bot.users.fetch(interaction.user.id)

        let embed = new MessageEmbed()
            .setAuthor(`${user.username}`, user.displayAvatarURL())
            .setDescription('Dine vennekoder')
            .setTimestamp()
            .setFooter(`${bot.user.username}`, `${bot.user.displayAvatarURL()}`)

        const allCodesRaw = await bot.settingsProvider.fetchFriendCode(interaction.guild.id, interaction.user.id, null, true)
        const allCodesFormatted = allCodesRaw.map(code => code.dataValues)

        if (allCodesFormatted.find(code => code.code_name === "main")) {
            const main = allCodesFormatted.find(code => code.code_name === "main")
            embed.addField("Main:", `${ main.code_value ? main.code_value : "Ingen code" }`)
        }
        if (allCodesFormatted.find(code => code.code_name === "smurf")) {
            const smurf = allCodesFormatted.find(code => code.code_name === "smurf")
            embed.addField("Smurf:", `${ smurf.code_value ? smurf.code_value : "Ingen code" }`)
        }

        await interaction.editReply({ embeds: [embed] })
    }
}