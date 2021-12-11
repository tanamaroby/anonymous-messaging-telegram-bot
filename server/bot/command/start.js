import createErrorMessage from "../util/error";

export default async function start(bot) {
    bot.start(async ctx => {
        try {
            await ctx.reply("Hi! Thanks for using Wakabubot. If you are using this bot in a group, each user please type /hellobot to use the bot. Type /help for more information on what the bot does and how to use the bot.\n\nReport any errors, issues, or suggestions to @tanamaroby on Telegram.")
        } catch (err) {
            console.log(createErrorMessage(`start`, ctx.message.from.username, err))
        }
    })
}