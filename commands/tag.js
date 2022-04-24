// noinspection DuplicatedCode

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

    async execute(bot, interaction, message, args) {
        async function command(bot, interaction, message, args) {
            if (message) {
                if (args[1] !== 'main' && args[1] !== 'smurf') return await message.channel.send('You need to specify `Main` or `Smurf`')
                if (!args[2]) return await message.channel.send('You need to specify your CS Friendcode')
            }

            const account = interaction ? interaction.options.getString('konto') : args[1]
            const code = interaction ? interaction.options.getString('kode') : args[2]

            const codes_if_exist = await bot.settingsProvider.fetchFriendCode(interaction ? interaction.guild.id : message.guildId, interaction ? interaction.user.id : message.author.id, account)

            if (codes_if_exist) {
                const data = codes_if_exist.dataValues
                if (data.code_name !== account) {
                    const phrase = "Encountered an error, please contact staff."
                    return interaction ? await interaction.editReply({
                        content: phrase
                    }) : await message.channel.send({
                        content: phrase
                    })
                }
                await bot.settingsProvider.updateFriendCode(data.id, code)
            } else {
                await bot.settingsProvider.createFriendCode(interaction ? interaction.guild.id : message.guildId, interaction ? interaction.user.id : message.author.id, account, code)
                    .catch(err => bot.logger.error(err.stack))
            }

            let user = await bot.users.fetch(interaction ? interaction.user.id : message.author.id)

            let embed = new MessageEmbed()
                .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                .setDescription('Dine vennekoder')
                .setTimestamp()
                .setFooter({ text: bot.user.username, iconUrl: bot.user.displayAvatarURL() })

            const allCodesRaw = await bot.settingsProvider.fetchFriendCode(interaction ? interaction.guildId : message.guildId, interaction ? interaction.user.id : message.author.id, null, true)
            const allCodesFormatted = allCodesRaw.map(code => code.dataValues)

            if (allCodesFormatted.find(code => code.code_name === "main")) {
                const main = allCodesFormatted.find(code => code.code_name === "main")
                embed.addField("Main:", `${ main.code_value ? main.code_value : "Ingen code" }`)
            }
            if (allCodesFormatted.find(code => code.code_name === "smurf")) {
                const smurf = allCodesFormatted.find(code => code.code_name === "smurf")
                embed.addField("Smurf:", `${ smurf.code_value ? smurf.code_value : "Ingen code" }`)
            }
            return embed
        }

        if (interaction) {
            interaction.deferReply()
                .then(async () => {
                    let response = await command(bot, interaction, message, args)
                    return await interaction.editReply({embeds: [response]})
                })
        }

        if (message) {
            let response = await command(bot, interaction, message, args)
            return await message.channel.send({ embeds: [response] })
        }
    }
}
