const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { vennekodeKanalId } = require('../settings.json')

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('team')
        .setDescription('Vennekoder for alle i stemme kanalen'),

    async execute(interaction, bot) {

        if (interaction.channelId !== vennekodeKanalId) {
            await interaction.reply({ content: `Denne kommand virker kun i <#${vennekodeKanalId}>` })
            setTimeout(() => interaction.deleteReply(), 5000)
            return;
        }

        await interaction.deferReply()

        const guild = await bot.guilds.fetch(interaction.guildId)
        const user = await guild.members.fetch(interaction.user.id)

        if (user.voice.channelId === null) {
            await interaction.editReply({ content: 'Du skal være i en voice kanal for at bruge denne kommand' })
                .then(reply => setTimeout(() => reply.delete(), 5000))
            return
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
            .setAuthor(`${guild.name}`, guild.iconURL())
            .setDescription(`Vennekoder for alle spillere i kanal: ${user.voice.channel.name}`)
            .setTimestamp()
            .setFooter(`${bot.user.username}`, `${bot.user.displayAvatarURL()}`)

        members.map(member => {
            let string
            if (member.codes.length > 1) {
                string = `\`\`Main:\`\` ${member.codes[0].main.codeValue} \`\`Smurf:\`\` ${member.codes[1].smurf.codeValue}`
            } else {
                string = `\`\`Main:\`\` ${member.codes[0] ? member.codes[0].main.codeValue : 'Ingen kode'}`
            }
            embed.addField(`${member.user.nickname ? member.user.nickname : member.user.username}`, string)
        })

        await interaction.editReply({ content: `<@${interaction.user.id}>`, embeds: [embed]})
    }
}
