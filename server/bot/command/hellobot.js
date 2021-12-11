import userGroupMapping from '../../services/user-group-mapping'
import groupIdNameMapping from "../../services/group-id-name-mapping";
import isGroup from "../util/is-group-check";
import createErrorMessage from "../util/error";
import forbiddenAction from '../util/forbidden-action'

/**
 * This function registers the user with the group ID into user_group_mapping table
 * 1. It first checks if users are sending the message privately or from a group (must be from groups)
 * 2. Then, it checks if the user has already been registered (exists in the table)
 * 3. If not, it then adds the user into the user_group_mapping table with both user_id and group_id
 * 4. It also maps group ID to group name in group_id_name_mapping table
 * @param bot The Telegraf bot
 */
export default async function hellobot(bot) {
    bot.command('hellobot', async ctx => {
        try {
            if (isGroup(ctx)) {
                const result = await userGroupMapping.findByUserIdAndGroupId(ctx.message.from.id, ctx.message.chat.id)
                if (result.length > 0) {
                    await ctx.reply(`Sorry but you are already registered in ${ctx.message.chat.title}, ${ctx.message.from.first_name}`)
                } else {
                    await userGroupMapping.insertByUserIdAndGroupId(ctx.message.from.id, ctx.message.chat.id)
                    await groupIdNameMapping.insertByIdAndGroupName(ctx.message.chat.id, ctx.message.chat.title)
                    await ctx.reply(`Thank you ${ctx.message.from.first_name} for registering! I have registered you in the group ${ctx.message.chat.title}. Message me privately for more commands.`)
                }
            } else {
                await ctx.reply(forbiddenAction.createGroupErrorCommand(ctx.message.from.first_name));
            }
        } catch (err) {
            console.log(createErrorMessage(`hellobot`, ctx.message.from.username, err))
        }
    })
}
