const cronJobs = require('../cron/cronjob.js')

module.exports = {
    name: 'ready',
    once: true,
    execute(bot) {
        console.log('Ready!')

        cronJobs.midnight(bot).start()
        console.log('- [CRONJOB] - Cron job every midnight')

        bot.settingsProvider.init(bot)
    }
}
