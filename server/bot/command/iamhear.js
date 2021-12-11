import constants from "../constants";
import createErrorMessage from "../util/error";
import iamhearDb from '../../services/iamhear'
import hearnowDb from '../../services/hearnow'
import userGroupMapping from "../../services/user-group-mapping";

async function getHearnowRequests(id) {
    let groups = await userGroupMapping.findByUserId(id);
    let result = [];
    if (groups.length > 0) {
        let groupIds = "(" + groups.map(group => group.group_id).join(",") + ")";
        result = await hearnowDb.findByGroupIdIn(groupIds);
    }
    return result;
}

async function assignIamhear(iamhear, hearnow) {
    await hearnowDb.deleteByHearnow(hearnow);
    await hearnowDb.deleteByHearnow(iamhear);
    await iamhearDb.insertByIamhearAndHearnow(iamhear, hearnow);
}

export default async function iamhear(bot) {
    bot.action(constants.I_AM_AVAILABLE, async (ctx) => {
        try {
            let hearnowRequests = await getHearnowRequests(ctx.callbackQuery.from.id);
            ctx.answerCbQuery();
            if ((await iamhearDb.findByIamhearOrHearnow(ctx.callbackQuery.from.id)).length > 0) {
                await ctx.reply("Sorry but you are in the middle of a conversation right now. Please end the conversation first using /end before starting another one");
            } else if (hearnowRequests.length <= 0) {
                ctx.reply("Sorry but no one in your group is looking for help right now. Thanks for the initiative and we will inform you once someone needs help 😁.");
            } else {
                let hearnowRecipient = null;
                for (let i = 0; i < hearnowRequests.length; i ++) {
                    if (ctx.callbackQuery.from.id != hearnow[i].hearnow) {
                        hearnowRecipient = hearnowRequests[i].hearnow;
                        break;
                    }
                }
                if (hearnowRecipient == null) {
                    await ctx.reply("Sorry but the hearnow request might have been taken up by someone!");
                } else {
                    await assignIamhear(ctx.callbackQuery.from.id, hearnowRecipient);
                    await ctx.editMessageText("Thank you! I will try to connect the two of you as fast as possible!");
                    await ctx.reply("💡 Wakabu tip 💡\n\nAs a listener, your role is to understand what is being said and remove your own judgements and opinions. This may require you to reflect "
                                + "on what is being said and to ask questions.\n\nReflect on what has been said by paraphrasing. Words like 'What I'm hearing is...', and 'Sounds like you are saying...' "
                                + "are great ways to reflect back.");
                    await ctx.reply("I have successfully established connection between the two of you.\n\nYou can now send messages to one another and use /end if you want to end the conversation.");
                    await ctx.telegram.sendMessage(hearnowRecipient, "Someone is here to talk to you\n\nYou can now send messages to one another and use /end if you want to end the conversation.");
                }
            }
        } catch (err) {
            console.log(createErrorMessage(`iamhear`, ctx.callbackQuery.from.username, err))
        }
    })
}
