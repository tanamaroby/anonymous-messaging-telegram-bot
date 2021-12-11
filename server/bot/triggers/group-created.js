import createErrorMessage from "../util/error";

export default async function groupCreated(bot) {
    bot.on(['group_chat_created', 'supergroup_chat_created'], async (ctx) => {
        try {
            await ctx.reply("Hi 👋! Thank you for adding me into this group. Please initiate my processing by using the command /start.");
        } catch (err) {
            console.log(createErrorMessage(`Group Chat Created`, ctx.update.message.chat.title, err));
        }
    });
}