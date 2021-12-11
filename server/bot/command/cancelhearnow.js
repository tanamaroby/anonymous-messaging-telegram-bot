import hearnowDb from '../../services/hearnow'
import createErrorMessage from "../util/error";
import isGroup from "../util/is-group-check";
import forbiddenAction from "../util/forbidden-action";

export default async function cancelhearnow(bot) {
    bot.command("cancelhearnow", async (ctx) => {
        try {
            if (isGroup(ctx)) {
                await ctx.reply(forbiddenAction.createPrivateErrorCommand(ctx.message.from.first_name));
            } else {
                if ((await hearnowDb.findByHearnow(ctx.message.from.id)).length > 0) {
                    await hearnowDb.deleteByHearnow(ctx.message.from.id);
                    await ctx.reply(`I have successfully cancelled your hearnow request. Feel free to use the function again using the /hearnow command.`);
                } else {
                    await ctx.reply(`You currently do not have any hearnow request pending!`);
                }
            }
        } catch (err) {
            console.log(createErrorMessage(`cancelhearnow`, ctx.message.from.username, err));
        }
    })
}