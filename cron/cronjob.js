const CronJob = require('cron').CronJob

exports.midnight = (bot) => {
    return new CronJob('59 59 23 * * *', function () {
        let log_channel = bot.channels.cache.get('903601843089866770')

        log_channel.send(`Der har været: ${bot.channelNumber - 1} gamerum idag.`)

        bot.channelNumber = 1
    }, null, true, 'Europe/Copenhagen')
}
