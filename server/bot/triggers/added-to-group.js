import createErrorMessage from "../util/error";

export default async function addedToGroup(bot) {
    bot.on('new_chat_members', async (ctx) => {
        try {
            let newMembers = ctx.update.message.new_chat_members;
            for (let newMember of newMembers) {
                if (newMember.id == bot.botInfo.id) {
                    await ctx.reply("Hi 👋! Thank you for adding me into this group. Please initiate my processing by using the command /start.");
                    break;
                }
            }
        } catch (err) {
            console.log(createErrorMessage(`Added To Group`, ctx.update.message.chat.title, err));
        }
    })
}