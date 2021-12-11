import createErrorMessage from "../util/error";
import groupIdNameMapping from "../../services/group-id-name-mapping";

export default async function newChatTitle(bot) {
    bot.on('new_chat_title', async (ctx) => {
        try {
            let newTitle = ctx.update.message.new_chat_title;
            let groupId = ctx.update.message.chat.id;
            await groupIdNameMapping.updateName(groupId, newTitle);
            await ctx.reply(`I have noted that you changed your group name to: ${newTitle}`);
        } catch (err) {
            console.log(createErrorMessage(`New Chat Title`, ctx.update.message.chat.title, err));
        }
    });
}