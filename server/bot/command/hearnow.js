import { Markup } from 'telegraf'
import hearnowDb from "../../services/hearnow"
import iamhearDb from "../../services/iamhear"
import userGroupMapping from "../../services/user-group-mapping";
import groupIdNameMapping from "../../services/group-id-name-mapping";
import createErrorMessage from "../util/error"
import isGroup from "../util/is-group-check"
import forbiddenAction from "../util/forbidden-action"
import constants from "../constants";

const iamhearMenu = Markup.inlineKeyboard([
    Markup.button.callback('I am available!', constants.I_AM_AVAILABLE),
])

function createGroupsMenu(groups) {
    var buttons = [];
    groups.forEach(group => {
        buttons.push([Markup.button.callback(group.group_name, group.id)]);
    })
    return Markup.inlineKeyboard(buttons);
}

export default async function hearnow(bot) {
    bot.command('hearnow', async ctx => {
        try {
            if (isGroup(ctx)) {
                await ctx.reply(forbiddenAction.createPrivateErrorCommand(ctx.message.from.first_name))
            } else {
                let result = await hearnowDb.findByHearnow(ctx.message.from.id)
                if (result.length > 0) {
                    // User has already initiated the hearnow search procedure
                    await ctx.reply(`Sorry but you have already initiated the hearnow search procedure, give us a moment while we try to match you with someone`)
                } else if ((await iamhearDb.findByIamhearOrHearnow(ctx.message.from.id)).length > 0) {
                    // User is currently still talking
                    await ctx.reply(`Sorry but you are in the middle of a conversation right now. Please end the conversation first using /end before starting another one`)
                } else {
                    let groups = (await userGroupMapping.findByUserId(ctx.message.from.id))
                    if (groups.length > 0) {
                        groups = groups.map(e => `'${e.group_id}'`).reduce((prev, next) => `${prev}, ${next}`)
                        groups = `(${groups})`
                        let groupIdNameMappings = await groupIdNameMapping.findByIdIn(groups)
                        if (groupIdNameMappings.length > 0) {
                            await ctx.reply(`Which group would you like me to match you with?`, createGroupsMenu(groupIdNameMappings))
                        } else {
                            await ctx.reply(`Apologies but we have encountered some error! Please report this issue to @tanamaroby`)
                        }
                    } else {
                        await ctx.reply(`Sorry but you are not registered in any groups right now. Please use the command /hellobot in a group before using this command`)
                    }
                }
            }
        } catch (err) {
            console.log(createErrorMessage(`hearnow`, ctx.message.from.username, err))
        }
    })

    bot.action(/^-?\d+\.?\d*$/, async (ctx) => {
        try {
            // Add user to hearnow table
            await hearnowDb.insertByHearnowAndGroupId(ctx.callbackQuery.from.id, ctx.callbackQuery.data);

            // Find user ids to send message to
            let users = await userGroupMapping.findByGroupId(ctx.callbackQuery.data);

            // Get group name
            let groupName = (await groupIdNameMapping.findById(ctx.callbackQuery.data)).map(e => e.group_name)[0];

            // Find all users currently in a conversation
            let unavailable = [];
            (await iamhearDb.findAll()).forEach(e => {
                unavailable.push(e.iamhear);
                unavailable.push(e.hearnow);
            })
            ctx.answerCbQuery();
            ctx.editMessageText("I will now contact the group members based on your preferences. You will be notified once they have responded.");
            users.forEach(user => {
                if (user.id != ctx.callbackQuery.from.id && !unavailable.includes(user.id)) {
                    bot.telegram.sendMessage(user.id, `Hi! Someone needs a listening ear from the group ${groupName}. Would you like to give them some support by chatting with them anonymously?\n\nThis will cancel any hearnow requests you have.`, iamhearMenu);
                }
            })
        } catch (err) {
            console.log(createErrorMessage(`hearnow`, ctx.callbackQuery.from.username, err));
        }
    });
}
