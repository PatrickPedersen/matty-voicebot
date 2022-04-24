// noinspection DuplicatedCode

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

    async execute(bot, interaction, message) {
        if (interaction) await interaction.deferReply()

        let user = await bot.users.fetch(interaction ? interaction.user.id : message.author.id)
        let allCodesRaw = await bot.settingsProvider.fetchFriendCode(interaction ? interaction.guild.id : message.guildId, interaction ? interaction.user.id : message.author.id, null, true)

        let embed = new MessageEmbed()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setDescription('Dine vennekoder')
            .setTimestamp()
            .setFooter({ text: bot.user.username, iconURL: bot.user.displayAvatarURL() })

        const allCodesFormatted = allCodesRaw.map(code => code.dataValues)

        if (allCodesFormatted.find(code => code.code_name === "main")) {
            const main = allCodesFormatted.find(code => code.code_name === "main")
            embed.addField("Main:", `${ main.code_value ? main.code_value : "Ingen code" }`)
        }
        if (allCodesFormatted.find(code => code.code_name === "smurf")) {
            const smurf = allCodesFormatted.find(code => code.code_name === "smurf")
            embed.addField("Smurf:", `${ smurf.code_value ? smurf.code_value : "Ingen code" }`)
        }

        if (interaction) {
            await interaction.editReply({ embeds: [embed] })
        }

        if (message) {
            message.channel.send({ embeds: [embed] })
        }
    }
}
