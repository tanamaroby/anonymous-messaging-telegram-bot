import userGroupMapping from "../../services/user-group-mapping";
import createErrorMessage from "../util/error";
import groupIdNameMapping from "../../services/group-id-name-mapping";

export default async function migrateChat(bot) {
    bot.on('migrate_to_chat_id', async (ctx) => {
        try {
            let prevId = ctx.update.message.chat.id;
            let newId = ctx.update.message.migrate_to_chat_id;
            await userGroupMapping.updateGroupId(prevId, newId);
            await groupIdNameMapping.updateId(prevId, newId);
        } catch (err) {
            console.log(createErrorMessage(`Migrate Chat ID`, ctx.update.message.chat.title, err));
        }
    });
}