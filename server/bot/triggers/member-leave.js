import createErrorMessage from "../util/error";
import groupIdNameMapping from "../../services/group-id-name-mapping";
import userGroupMapping from "../../services/user-group-mapping";

export default async function memberLeave(bot) {
    bot.on('left_chat_member', async (ctx) => {
        let groupId = ctx.update.message.chat.id;
        let memberId = ctx.update.message.left_chat_member.id;
        try {
            if (memberId == bot.botInfo.id) {
                await groupIdNameMapping.deleteById(groupId);
                await userGroupMapping.deleteByGroupId(groupId);
            } else {
                await userGroupMapping.deleteByUserIdAndGroupId(memberId, groupId);
            }
            // Check if the bot is the only one left
            if (await ctx.getChatMembersCount() <= 1) {
                await groupIdNameMapping.deleteById(groupId);
                await userGroupMapping.deleteByGroupId(groupId);
                await ctx.leaveChat();
            }
        } catch (err) {
            if (err.response.error_code == 403 || err.response.error_code == 400) {
                console.log("Group chat is no longer accessible: " + err.message);
                console.log("The forbidden group chat has been unregistered");
                await groupIdNameMapping.deleteById(groupId);
                await userGroupMapping.deleteByGroupId(groupId);
            }
            console.log(createErrorMessage(`Member Leave`, ctx.update.message.chat.title, err));
        }
    })
}