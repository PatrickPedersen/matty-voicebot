const { ny_talekanal_id, csgo_kategori_id } = require('../settings.json')
module.exports = {
    name: 'voiceStateUpdate',
    async execute(bot, oldState, newState) {
        const primary_channel = bot.channels.cache.get(ny_talekanal_id)
        const csgo_categoryId = bot.channels.cache.get(csgo_kategori_id)

        if (primary_channel.members.size > 0) {
            let csgo_members

            if (oldState.channelId !== null) {
                let old_channel = bot.channels.cache.get(oldState.channelId)
                if (old_channel.parentId === csgo_categoryId.id) {
                    csgo_members = old_channel.members
                }
            }

            let created_channel_amount = bot.channelNumber++
            let parent_channel = bot.channels.cache.get(primary_channel.parentId)

            await newState.guild.channels.create(`Gamerum #${created_channel_amount}`, {
                type: "GUILD_VOICE",
                parent: parent_channel
            })
                .then(data => {
                    newState.setChannel(data)
                    return data
                })
                .then(async data => {
                    if (csgo_members === undefined || null) return
                    for (let member of csgo_members) {
                        let member_object = await newState.guild.members.fetch(member[0])
                        await member_object.voice.setChannel(data)
                    }
                })

        }

        if (oldState.channelId === null) return

        if (oldState.channelId !== primary_channel.id) {
            let old_channel = bot.channels.cache.get(oldState.channelId)
            if (old_channel.members.size <= 0 && old_channel.parentId === primary_channel.parentId) {
                old_channel.delete()
            }
        }
    }
}
