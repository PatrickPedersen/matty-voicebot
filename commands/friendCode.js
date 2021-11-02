const { SlashCommandBuilder } = require('@discordjs/builders')
const {MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vennekode')
        .setDescription('Vennekode Kommandoer')
        .addSubcommand(subcommand =>
            subcommand
                .setName('vis')
                .setDescription('Viser ens vennekoder')
        ),

    async execute(interaction, bot) {
        await interaction.deferReply()

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
