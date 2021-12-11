import createErrorMessage from "../util/error";

export default async function help(bot) {
    const feature1 = "GROUP FEATURE\n\n1. Perform check-in on your group members using the command /checkin. This is automatically triggered twice a week on Wednesdays and Sundays."
    const feature2 = "PERSONAL FEATURE\n\n1. Talk to other group members anonymously using /hearnow command. ❗ Only available after using /hellobot in a group."
    const feature3 = "2. Create profile using /setup command to for more specialized tips and indicate preferences."
    bot.help(async ctx => {
        try {
            await ctx.reply(`${feature1}\n\n${feature2}\n\n${feature3}`)
        } catch (err) {
            console.log(createErrorMessage(`help`, ctx.message.from.username, err))
        }
    })
}
