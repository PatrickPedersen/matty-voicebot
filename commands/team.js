const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { vennekodeKanalId } = require('../settings.json')

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('team')
        .setDescription('Vennekoder for alle i stemme kanalen'),

    async execute(bot, interaction, message) {
        let channelId = interaction ? interaction.channelId : message.channel.id

        if (channelId !== vennekodeKanalId) {
            const phrase = `This command only works in channel <#${vennekodeKanalId}>`
            // Ternary Operation. If Interaction exists continue with interaction reply otherwise continue with message reply.
            interaction ? await interaction.reply({ content: phrase }) : await message.channel.send(phrase)
            if (interaction) setTimeout(() => interaction.deleteReply(), 5000)
            return;
        }

        if (interaction) await interaction.deferReply()

        const guild = await bot.guilds.fetch(interaction ? interaction.guildId : message.guildId)
        const user = await guild.members.fetch(interaction ? interaction.user.id : message.author.id)

        if (user.voice.channelId === null) {
            if (interaction) {
                return await interaction.editReply({ content: 'Du skal være i en voice kanal for at bruge denne kommand' })
                    .then(reply => setTimeout(() => reply.delete(), 5000))
            }
            if (message) {
                await message.channel.send('You need to be in a voice channel to use this command')
                    .then(m => setTimeout(() => m.delete(), 5000))
                return message.delete()
            }
        }

        const voiceChannelMembers = (await guild.channels.fetch(user.voice.channelId)).members.map(member => member.user)
        const members = []

        for (let member of voiceChannelMembers) {
            let data = await guild.members.fetch(member.id)
            let dbData = await bot.settingsProvider.fetchFriendCode(guild.id, member.id, null, true)

            if (dbData !== []) {
                let dbDataFormatted = dbData.map(code => code.dataValues)
                let obj = {
                    user: {
                        id: data.user.id,
                        username: data.user.username,
                        discriminator: data.user.discriminator,
                        nickname: data.nickname,
                    },
                    codes: []
                }
                if (dbDataFormatted.find(code => code.code_name === "main")) {
                    const main = dbDataFormatted.find(code => code.code_name === "main")
                    obj.codes.push({
                        main: {
                            codeName: main.code_name,
                            codeValue: main.code_value
                        }
                    })
                }
                if (dbDataFormatted.find(code => code.code_name === "smurf")) {
                    const smurf = dbDataFormatted.find(code => code.code_name === "smurf")
                    obj.codes.push({
                        smurf: {
                            codeName: smurf.code_name,
                            codeValue: smurf.code_value
                        }
                    })
                }
                members.push(obj)
            } else {
                let obj = {
                    user: {
                        id: data.user.id,
                        username: data.user.username,
                        discriminator: data.user.discriminator,
                        nickname: data.nickname,
                    },
                    codes: []
                }
                members.push(obj)
            }
        }

        let embed = new MessageEmbed()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL()})
            .setDescription(`Friend codes for all players in channel: ${user.voice.channel.name}`)
            .setTimestamp()
            .setFooter({ text: bot.user.username, iconURL: `${bot.user.displayAvatarURL()}`})

        members.map(member => {
            let string
            if (member.codes.length > 1) {
                string = `\`\`Main:\`\` ${member.codes[0].main.codeValue} \`\`Smurf:\`\` ${member.codes[1].smurf.codeValue}`
            } else {
                string = `\`\`Main:\`\` ${member.codes[0] ? member.codes[0].main.codeValue : 'Ingen kode'}`
            }
            embed.addField(member.user.nickname ? member.user.nickname : member.user.username, string)
        })

        interaction ? await interaction.editReply({
            content: `<@${interaction ? interaction.user.id : message.author.id}>`,
            embeds: [embed]
        }) : await message.channel.send({
            content: `<@${interaction ? interaction.user.id : message.author.id}>`,
            embeds: [embed]
        })
    }
}
