import iamhearDb from "../../services/iamhear";
import createErrorMessage from "../util/error";
import isGroup from "../util/is-group-check";
import forbiddenAction from "../util/forbidden-action";

export default async function end(bot) {
    bot.command("end", async (ctx) => {
        try {
            if (isGroup(ctx)) {
                await ctx.reply(forbiddenAction.createPrivateErrorCommand(ctx.message.from.first_name));
            } else {
                let participants = await iamhearDb.findByIamhearOrHearnow(ctx.message.from.id);
                if (participants.length > 0) { // Currently talking
                    await iamhearDb.deleteByIamHearOrHearnow(ctx.message.from.id);
                    await ctx.telegram.sendMessage(participants[0].hearnow, `The conversation has ended. Feel free to use /hearnow again to chat with someone whenever you need it.`);
                    await ctx.telegram.sendMessage(participants[0].iamhear, `The conversation has ended. Thank you for giving a listening ear.`);
                } else {
                    await ctx.reply(`You are not in a conversation right now. Feel free to chat using /hearnow to find someone to chat with from your group.`);
                }
            }
        } catch (err) {
            console.log(createErrorMessage(`end`, ctx.message.from.username, err));
        }
    });
}