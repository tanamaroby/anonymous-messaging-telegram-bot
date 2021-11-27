import { Telegraf, Markup } from 'telegraf';
import constants from "./constants";

// Import commands
import start from "./command/start";
import help from "./command/help";
import register from "./command/register";
import setup from "./command/setup";
import hearnow from "./command/hearnow";
import iamhear from './command/iamhear';
import db from '../services/db';

// Bot buttons
const genderMenu = Markup.inlineKeyboard([
    Markup.button.callback('Male', constants.Gender.MALE),
    Markup.button.callback('Female', constants.Gender.FEMALE),
    Markup.button.callback('Anyone', constants.Gender.ANYONE)
]);

const preferredGenderMenu = Markup.inlineKeyboard([
    Markup.button.callback('Male', constants.PreferredGender.MALE),
    Markup.button.callback('Female', constants.PreferredGender.FEMALE),
    Markup.button.callback('Anyone', constants.PreferredGender.ANYONE)
])

const iamhearMenu = Markup.inlineKeyboard([
    Markup.button.callback('I am available!', constants.I_AM_AVAILABLE),
])

// Bot commands
export const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(start));
bot.help((ctx) => ctx.reply(help));
bot.command('hellobot', async (ctx) => {
    let name = ctx.message.from.first_name; 
    if (ctx.message.chat.type == 'group' || ctx.message.chat.type == "supergroup") {
        const response = await register.register(ctx.message.from, ctx.message.chat).catch(err => console.log("Unable to register user error: " + err));
        ctx.reply(response);
    } else if (ctx.message.chat.type == "private") {
        ctx.reply("🙇 Apologies " + name + " but you can only use this command in groups!");
    }
});

bot.command('setup', (ctx) => {
    let name = ctx.message.from.first_name; 
    if (ctx.message.chat.type == 'group' || ctx.message.chat.type == "supergroup") {
        ctx.reply("🙇 Apologies " + name + " but you have to message me privately for this command!");
    } else if (ctx.message.chat.type == "private") {
        ctx.reply('Select your gender', genderMenu);
    }
});

bot.command("hearnow", async (ctx) => {
    let name = ctx.message.from.first_name; 
    if (ctx.message.chat.type == 'group' || ctx.message.chat.type == "supergroup") {
        ctx.reply("🙇 Apologies " + name + " but you have to message me privately for this command!");
    } else if (ctx.message.chat.type == "private") {
        if (await hearnow.isHearnow(ctx.message.from).catch(err => console.log("Unable to get check if the user has initiated hearnow: " + err))) {
            ctx.reply("Sorry but you have already initiated the hearnow procedure. Give us a moment while we try out best to match you with someone");
        } else if (await iamhear.isTalking(ctx.message.from).catch(err => console.log("Unable to check if the user is talking: " + err))) {``
            ctx.reply("Sorry but you are in the middle of a conversation right now. Please end the conversation first using /end before starting another one");
        } else {
            var groupsMenu = await hearnow.hearnow(ctx.message.from).catch(err => console.log("Unable to find hearnow groups: " + err));
            if (groupsMenu.length > 0) {
                ctx.reply("Which group would you like me to match you with?", groupsMenu);
            } else {
                ctx.reply("You are not registered to any group! Please use /hellobot on your group before using this command");
            }
        }
    }
});

bot.command("cancelhearnow", async (ctx) => {
    let name = ctx.message.from.first_name; 
    if (ctx.message.chat.type == 'group' || ctx.message.chat.type == "supergroup") {
        ctx.reply("🙇 Apologies " + name + " but you have to message me privately for this command!");
    } else if (ctx.message.chat.type == "private") {
        if (await hearnow.isHearnow(ctx.message.from).catch(err => console.log("Unable to check if the user is currently in hearnow procedure: " + err))) {
            await hearnow.cancelHearnow(ctx.message.from).catch(err => console.log("Unable to cancel hearnow process: " + err));
            ctx.reply("I have cancelled your hearnow request.");
        } else {
            ctx.reply("You do not have any hearnow request pending right now.");
        }
    }
})

bot.command("end", async (ctx) => {
    let name = ctx.message.from.first_name; 
    if (ctx.message.chat.type == 'group' || ctx.message.chat.type == "supergroup") {
        ctx.reply("🙇 Apologies " + name + " but you have to message me privately for this command!");
    } else if (ctx.message.chat.type == "private") {
        if (await iamhear.isTalking(ctx.message.from).catch(err => console.log("Unable to check who is talking for end function: " + err))) {
            var result = await iamhear.endConversation(ctx.message.from).catch(err => console.log("Unable to end conversation: " + err));
            ctx.telegram.sendMessage(result.hearnow, "The conversation has ended. I hope that the experience has been positive for you.")
            .catch(err => console.log("Unable to send message to hearnow recipient for ending conversation: " + err));
            ctx.telegram.sendMessage(result.iamhear, "The conversation has ended. Thank you for giving a listening ear.")
            .catch(err => console.log("Unable to send message to iamhear recipient for ending conversation: " + err));
        } else {
            ctx.reply("You are not in a conversation right now. Feel free to chat using /hearnow to find someone to chat with from your group.");
        }
    }
});

bot.command("checkin", async (ctx) => {
    let name = ctx.message.from.first_name; 
    if (ctx.message.chat.type == 'group' || ctx.message.chat.type == "supergroup") {
        var question = "How are you feeling?"
        var answers = [
            "😁 Super awesome",
            "😀 Pretty good",
            "😐 Okay",
            "☹️ Somewhat bad",
            "😔 Really terrible"
        ]
        ctx.replyWithPoll(question, answers);
    } else if (ctx.message.chat.type == "private") {
        ctx.reply("🙇 Apologies " + name + " but you can only use this command in groups!");
    }
});

bot.action([constants.Gender.MALE, constants.Gender.FEMALE, constants.Gender.ANYONE], async (ctx) => {
    await setup.setupGender(ctx.callbackQuery.from, ctx.callbackQuery.data).catch(err => console.log("Unable to setup gender error: " + err));
    ctx.answerCbQuery();
    ctx.editMessageText("You have selected " + ctx.callbackQuery.data + " as your gender");   
    ctx.reply("When you use the command /hearnow, I will send anonymous conversation request to all your group members so that they "
    + "can chat with you privately and anonymously if they are available. What gender would you prefer this listening ear be?", preferredGenderMenu);
});

bot.action([constants.PreferredGender.MALE, constants.PreferredGender.FEMALE, constants.PreferredGender.ANYONE], async (ctx) => {
    await setup.setupPreferredGender(ctx.callbackQuery.from, ctx.callbackQuery.data).catch(err => console.log("Unable to setup preferred gender error: " + err));
    ctx.answerCbQuery();
    ctx.editMessageText("You stated that you " + ctx.callbackQuery.data + " for a listening ear. Note that, in the event only one person is available, we will match you with that "
    + "person. You will be notified of their gender and have the option to terminate the chat.");
    ctx.reply("Thanks for setting up your profile! Feel free to use the /hearnow command to chat with someone from your registered groups.");
});

bot.action(constants.I_AM_AVAILABLE, async (ctx) => {
    ctx.answerCbQuery();
    var hearnow = await iamhear.findHearnow(ctx.callbackQuery.from).catch(err => console.log("Unable to find hearnow people for i am available: " + err));
    if (await iamhear.isTalking(ctx.callbackQuery.from).catch(err => console.log("Unable to find who is talking from i am available: " + err))) { 
        ctx.reply("Sorry but you are in the middle of a conversation right now. Please end the conversation first using /end before starting another one");
    } else if (hearnow.length <= 0) {
        ctx.reply("Sorry but no one in your group is looking for help right now. Thanks for the initiative and we will inform you once someone needs help 😁.");
    } else {
        var length = hearnow.length;
        var hearnowId = null;
        for (let i = 0; i < length; i ++) { 
            if (ctx.callbackQuery.from.id != hearnow[i].hearnow) {
                hearnowId = hearnow[i].hearnow;
                break;
            }
        }
        if (hearnowId == null) {
            ctx.reply("Sorry but the hearnow request might have been taken up by someone!");
        } else if (ctx.callbackQuery.from.id != hearnowId) {
            await iamhear.assignIamhear(ctx.callbackQuery.from.id, hearnowId).catch(err => console.log("Unable to assign I am hear: " + err));
            ctx.editMessageText("Thank you! I will try to connect the two of you as fast as possible!");
            ctx.reply("💡 Wakabu tip 💡\n\nAs a listener, your role is to understand what is being said and remove your own judgements and opinions. This may require you to reflect "
            + "on what is being said and to ask questions.\n\nReflect on what has been said by paraphrasing. Words like 'What I'm hearing is...', and 'Sounds like you are saying...' "
            + "are great ways to reflect back.");
            ctx.reply("I have successfully established connection between the two of you.\n\nYou can now send messages to one another and use /end if you want to end the conversation.");
            ctx.telegram.sendMessage(hearnowId, "Someone is here to talk to you\n\nYou can now send messages to one another and use /end if you want to end the conversation.")
            .catch(err => console.log("Unable to send message to the hearnow recipient: " + err));
        } else {
            ctx.reply("You can't match with yourself 😢, please wait until someone picks up");
        }
    }
})

// Secret command to refresh group incase anything goes wrong
bot.command('refreshallmygroupsthx', async (ctx) => {
    let userGroupMappings = await db.query("SELECT * FROM USER_GROUP_MAPPING");
    let groupIdNameMappings = await db.query("SELECT * FROM GROUP_ID_NAME_MAPPING");
    let groupIds = [];
    userGroupMappings.forEach(group => {
        if (!groupIds.includes(group.group_id)) {
            groupIds.push(group.group_id)
        }
    })
    groupIdNameMappings.forEach(group => {
        if (!groupIds.includes(group.id)) {
            groupIds.push(group.id)
        }
    })
    groupIds.forEach(async group => {
        try {
            let membersCount = await ctx.telegram.getChatMembersCount(group)
            if (membersCount <= 1) {
                await register.unregisterGroup(group)
                ctx.telegram.leaveChat(group)
            }
        }
        catch (err) {
            if (err.response.error_code == 403 || err.response.error_code == 400) {
               await register.unregisterGroup(group)
            }
        }
    })
    ctx.reply("Refreshed");
})

bot.action(/^-?\d+\.?\d*$/, async (ctx) => {
    var userIds = await hearnow.getGroups(ctx.callbackQuery.data).catch(err => console.log("Unable to get user Ids of the selected group: " + err));
    await hearnow.addHearnow(ctx.callbackQuery.from, ctx.callbackQuery.data).catch(err => console.log("Unable to create hearnow for user: " + err));
    var result = await iamhear.getTalking().catch(err => console.log("Unable to get all talking people for hearnow function: " + err));
    var talking = [];
    var groupName = await iamhear.getGroupName(ctx.callbackQuery.data).catch(err => console.log("Unable to get groupname from groupId: " + err))
    result.forEach(elem => {
        talking.push(elem.iamhear);
        talking.push(elem.hearnow);
    })
    ctx.answerCbQuery();
    ctx.editMessageText("Okay I got it 😁. I will now contact the group members based on your preferences. Please be patient while we wait for them to respond.");
    userIds.forEach(userId => {
        if (userId != ctx.callbackQuery.from.id && !talking.includes(userId)) {
            bot.telegram.sendMessage(userId, "👋 Hi! Someone needs a listening ear from " + groupName.group_name + ". Would you like to give them some support by chatting with them anonymously?\n\nKeep in mine this will cancel any hearnow request you have.", iamhearMenu)
            .catch(err => console.log("Unable to send message to the specified user ID for hearnow blast: " + err));
        }
    })
});

bot.on(['group_chat_created', 'supergroup_chat_created'], async (ctx) => {
    ctx.reply("Hi 👋! Thank you for adding me into this group. Please initiate my processing by using the command /start.");
});

bot.on('migrate_to_chat_id', async (ctx) => {
    var previousGroupId = ctx.update.message.chat.id;
    var newGroupId = ctx.update.message.migrate_to_chat_id;
    register.updateGroup(previousGroupId, newGroupId).catch(err => console.log("Unable to update group after migrating to supergroup"));
});

bot.on('new_chat_members', async (ctx) => {
    var memberIds = ctx.update.message.new_chat_members;
    memberIds.forEach(memberId => {
        if (memberId.id == bot.botInfo.id) {
            ctx.reply("Hi 👋! Thank you for adding me into this group. Please initiate my processing by using the command /start.");
        }
    })
})

bot.on('new_chat_title', async (ctx) => {
    var newTitle = ctx.update.message.new_chat_title;
    var groupId = ctx.update.message.chat.id;
    await register.registerGroup(groupId, newTitle).catch(err => console.log("Unable to register new group name: " + err));
    ctx.reply("I have noted that you changed your group name to: " + newTitle);
});

bot.on('left_chat_member', async (ctx) => {
    var groupId = ctx.update.message.chat.id;
    var memberId = ctx.update.message.left_chat_member.id;
    try {
        if (memberId == bot.botInfo.id) {
            await register.unregisterGroup(groupId).catch(err => console.log("Unable to delete group from database: " + err));
        } else {
            await register.unregister(memberId, groupId).catch(err => console.log("Unable to unregister member from database: "+ err));
        }
        if (await ctx.getChatMembersCount() <= 1) {
            console.log("Only the bot left for group: " + groupId);
            await register.unregisterGroup(groupId).catch("Unable to unregister group when only 1 member left");
            await ctx.leaveChat().catch("Unable to leave chat");
        }
    } catch (err) {
        if (err.response.error_code == 403 || err.response.error_code == 400) {
            console.log("Group chat is no longer accessible: " + err.message);
            console.log("The forbidden group chat has been unregistered");
            await register.unregisterGroup(groupId).catch("Unable to unregister forbidden group")
        }
    }
})

bot.on(['text', 'sticker'], async (ctx) => {
    if (ctx.message.chat.type == "private") {
        if (await iamhear.isTalking(ctx.message.from).catch(err => console.log("Unable to check who is talking when sending message " + err))) {
            var iamhearId = await iamhear.getIamhear(ctx.message.from).catch(err => console.log("Unable to get I am hear person: " + err));
            var hearnowId = await iamhear.getHearnow(ctx.message.from).catch(err => console.log("Unable to get hearnow person: " + err));
            if (iamhearId.length > 0 || hearnowId.length > 0) {
                var object  = iamhearId.length > 0 ? iamhearId[0] : hearnowId[0];
                var id = object.hearnow == ctx.message.from.id ? object.iamhear : object.hearnow;
                if (ctx.message.sticker != undefined || ctx.message.sticker != null) {
                    ctx.telegram.sendSticker(id, ctx.message.sticker.file_id).catch(err => "Unable to send sticker to recipient: " + err)
                } else {
                    ctx.telegram.sendMessage(id, ctx.message.text).catch(err => "Unable to send text message to recipient: " + err)
                }
            } else {
                ctx.reply("🙏 Sorry but we have issues connecting you with the other person. Please report this error to @tanamaroby.")
                .catch(err => "Unable to send error message when cannot find iamhear or hearnow: " + err);
            }
        }
    }
});

bot.catch((err, ctx) => {
    console.log("The bot has encountered an error for " + ctx.updateType, err);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot;