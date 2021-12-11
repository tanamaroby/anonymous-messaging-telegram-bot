import createErrorMessage from "../util/error";
import isGroup from "../util/is-group-check";
import iamhearDb from "../../services/iamhear"

export default async function conversation(bot) {
    bot.on(['text', 'sticker'], async (ctx) => {
        try {
            if (!isGroup(ctx)) {
                let participants = await iamhearDb.findByIamhearOrHearnow(ctx.message.from.id);
                if (participants.length > 0) {
                    let recipient = participants[0].hearnow == ctx.message.from.id ? participants[0].iamhear : participants[0].hearnow;
                    if (ctx.message.sticker != undefined || ctx.message.sticker != null) {
                        await ctx.telegram.sendSticker(recipient, ctx.message.sticker.file_id);
                    } else {
                        await ctx.telegram.sendMessage(recipient, `🗣️: ${ctx.message.text}`);
                    }
                }
            }
        } catch (err) {
            console.log(createErrorMessage(`conversation`, ctx.message.from.username, err))
        }
    });
}