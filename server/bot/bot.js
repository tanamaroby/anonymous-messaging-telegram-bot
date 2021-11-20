import { Telegraf, Markup } from 'telegraf';
import constants from "./constants";

// Import commands
import start from "./command/start";
import help from "./command/help";
import register from "./command/register";
import setup from "./command/setup";
import hearnow from "./command/hearnow";
import iamhear from './command/iamhear';

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

bot.action([constants.Gender.MALE, constants.Gender.FEMALE, constants.Gender.ANYONE], async (ctx) => {
    await setup.setupGender(ctx.callbackQuery.from, ctx.callbackQuery.data).catch(err => console.log("Unable to setup gender error: " + err));
    ctx.answerCbQuery();
    ctx.editMessageText("You have selected " + ctx.callbackQuery.data + " as your gender");   
    ctx.reply("When you are in distress 🔊, I will notify your group chat members anonymously that someone needs a listening ear. If a person is available to be a listening ear, they "
    + "can chat with you privately and anonymously. What gender would you prefer this listening ear be?", preferredGenderMenu);
});

bot.action([constants.PreferredGender.MALE, constants.PreferredGender.FEMALE, constants.PreferredGender.ANYONE], async (ctx) => {
    await setup.setupPreferredGender(ctx.callbackQuery.from, ctx.callbackQuery.data).catch(err => console.log("Unable to setup preferred gender error: " + err));
    ctx.answerCbQuery();
    ctx.editMessageText("You stated that you " + ctx.callbackQuery.data + " for a listening ear. Note that, in the event only one person is available, we will match you with that "
    + "person. You will be notified of their gender and have the option to terminate the chat.");
    ctx.reply("Thanks for setting up your profile! I can help you with:\n\n🔊 I am in distress. I need someone /hearnow. When in distress, I will notify your registered group chat members anonymously that someone needs a "
    + "listening ear. I'll provide tips to ensure safe and empathetic support is given.");
});

bot.command("hearnow", async (ctx) => {
    let name = ctx.message.from.first_name; 
    if (ctx.message.chat.type == 'group' || ctx.message.chat.type == "supergroup") {
        ctx.reply("🙇 Apologies " + name + " but you have to message me privately for this command!");
    } else if (ctx.message.chat.type == "private") {
        if (await hearnow.isHearnow(ctx.message.from).catch(err => console.log("Unable to get check if the user has initiated hearnow: " + err))) {
            ctx.reply("Sorry but you have already initiated the hearnow procedure. Please wait while we try out best to match you with someone 😁");
        } else if (await iamhear.isTalking(ctx.message.from).catch(err => console.log("Unable to check if the user is talking: " + err))) {``
            ctx.reply("Sorry but you are in the middle of a conversation right now. Please end the conversation first using /end before starting another one");
        } else {
            var groupsMenu = await hearnow.hearnow(ctx.message.from).catch(err => console.log("Unable to find hearnow groups: " + err));
            if (groupsMenu.reply_markup.inline_keyboard.length > 0) {
                ctx.reply("Which group would you like me to match you with?", groupsMenu);
            } else {
                ctx.reply("You are not registered to any group! Please use /hellobot on your group before using this command");
            }
        }
    }
});

const cancelHearnowMenu = Markup.inlineKeyboard([
    Markup.button.callback('Cancel', constants.CANCEL_HEARNOW),
])

const iamhearMenu = Markup.inlineKeyboard([
    Markup.button.callback('I am available!', constants.I_AM_AVAILABLE),
])

bot.action(/^-?\d+\.?\d*$/, async (ctx) => {
    var userIds = await hearnow.getGroups(ctx.callbackQuery.data).catch(err => console.log("Unable to get user Ids of the selected group: " + err));
    await hearnow.addHearnow(ctx.callbackQuery.from, ctx.callbackQuery.data).catch(err => console.log("Unable to create hearnow for user: " + err));
    var result = await iamhear.getTalking().catch(err => console.log("Unable to get all talking people for hearnow function: " + err));
    var talking = [];
    result.forEach(elem => {
        talking.push(elem.iamhear);
        talking.push(elem.hearnow);
    })
    ctx.answerCbQuery();
    ctx.editMessageText("Okay I got it 😁. I will now contact the group members based on your preferences. Please be patient while we wait for them to respond.", cancelHearnowMenu);
    userIds.forEach(userId => {
        if (userId != ctx.callbackQuery.from.id && !talking.includes(userId)) {
            bot.telegram.sendMessage(userId, "👋 Hi! Someone needs a listening ear from your group. Would you like to give them some support by chatting with them anonymously?", iamhearMenu)
            .catch(err => console.log("Unable to send message to the specified user ID for hearnow blast: " + err));
        }
    })
});

bot.action(constants.CANCEL_HEARNOW, async (ctx) => {
    ctx.answerCbQuery();
    if (await hearnow.isHearnow(ctx.callbackQuery.from).catch(err => console.log("Unable to check if the user is currently in hearnow procedure: " + err))) {
        await hearnow.cancelHearnow(ctx.callbackQuery.from).catch(err => console.log("Unable to cancel hearnow process: " + err));
        ctx.editMessageText("I have cancelled your hearnow request. Feel free to use my services again 😀!");
    } else {
        ctx.reply("You do not have any hearnow request pending right now.");
    }
})

bot.action(constants.I_AM_AVAILABLE, async (ctx) => {
    ctx.answerCbQuery();
    var hearnow = await iamhear.findHearnow(ctx.callbackQuery.from).catch(err => console.log("Unable to find hearnow people for i am available: " + err));
    if (await iamhear.isTalking(ctx.callbackQuery.from).catch(err => console.log("Unable to find who is talking from i am available: " + err))) { 
        ctx.reply("Sorry but you are in the middle of a conversation right now. Please end the conversation first using /end before starting another one");
    } else if (hearnow.length <= 0) {
        ctx.reply("Sorry but no one in your group is looking for help right now. Thanks for the initiative and we will inform you once someone needs help 😁.");
    } else {
        if (ctx.callbackQuery.from.id != hearnow[0].hearnow) {
            await iamhear.assignIamhear(ctx.callbackQuery.from.id, hearnow[0]).catch(err => console.log("Unable to assign I am hear: " + err));
            ctx.editMessageText("Thank you! I will try to connect the two of you as fast as possible!");
            ctx.reply("💡 Wakabu tip 💡\n\nAs a listener, your role is to understand what is being said and remove your own judgements and opinions. This may require you to reflect "
            + "on what is being said and to ask questions.\n\nReflect on what has been said by paraphrasing. Words like 'What I'm hearing is...', and 'Sounds like you are saying...' "
            + "are great ways to reflect back.");
            ctx.reply("Okay 😄, I have successfully established connection between the two of you.\n\nSend message to one another by starting your message with the command /hear. " 
            + "\n\nFor example: /hear How are you doing? will send the message 'How are you doing?' to your recipient.\n\nUse /end to end the conversation");
            ctx.telegram.sendMessage(hearnow[0].hearnow, "🎊 Someone is now here to support you 🎊\n\nYou can talk to each other by starting your message with the command /hear. "
            + "\n\nFor example: /hear I want to talk for a little bit will send the message 'I want to talk for a little bit' to your recipient.\n\nUse /end to end the conversation.")
            .catch(err => console.log("Unable to send message to the hearnow recipient: " + err));
        } else {
            ctx.reply("You can't match with yourself 😢, please wait until someone picks up");
        }
    }
})

bot.command("hear", async (ctx) => {
    let name = ctx.message.from.first_name; 
    if (ctx.message.chat.type == 'group' || ctx.message.chat.type == "supergroup") {
        ctx.reply("🙇 Apologies " + name + " but you have to message me privately for this command!");
    } else if (ctx.message.chat.type == "private") {
        var iamhearId = await iamhear.getIamhear(ctx.message.from).catch(err => console.log("Unable to get I am hear person: " + err));
        var hearnowId = await iamhear.getHearnow(ctx.message.from).catch(err => console.log("Unable to get hearnow person: " + err));
        if (iamhearId.length > 0 || hearnowId.length > 0) {
            var object  = iamhearId.length > 0 ? iamhearId[0] : hearnowId[0];
            var id = object.hearnow == ctx.message.from.id ? object.iamhear : object.hearnow;
            ctx.telegram.sendMessage(id, "🗣️: " + ctx.message.text.split(" ").slice(1).join(" ")).catch(err => console.log("Unable to send message to the recipient for hear function: " + err));
        } else {
            ctx.reply("🙏 Sorry but you are not connected to anyone right now. Please use /hearnow to connect with a listening ear.");
        }
    }
});

bot.command("end", async (ctx) => {
    let name = ctx.message.from.first_name; 
    if (ctx.message.chat.type == 'group' || ctx.message.chat.type == "supergroup") {
        ctx.reply("🙇 Apologies " + name + " but you have to message me privately for this command!");
    } else if (ctx.message.chat.type == "private") {
        if (await iamhear.isTalking(ctx.message.from).catch(err => console.log("Unable to check who is talking for end function: " + err))) {
            var result = await iamhear.endConversation(ctx.message.from).catch(err => console.log("Unable to end conversation: " + err));
            ctx.telegram.sendMessage(result.hearnow, "The conversation has ended 😌. I hope that the experience has been positive for you and feel free to use Wakabubot services again 👋!")
            .catch(err => console.log("Unable to send message to hearnow recipient for ending conversation: " + err));
            ctx.telegram.sendMessage(result.iamhear, "The conversation has ended 😌. I hope that you are able to help someone and feel free to use Wakabubot services again 👋!")
            .catch(err => console.log("Unable to send message to iamhear recipient for ending conversation: " + err));
        } else {
            ctx.reply("You are not in a conversation right now ☹️. Feel free to chat using /hearnow to find someone to chat with from your group.");
        }
    }
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
    if (memberId == bot.botInfo.id) {
        await register.unregisterGroup(groupId).catch(err => console.log("Unable to delete group from database: " + err));
    } else {
        await register.unregister(memberId, groupId).catch(err => console.log("Unable to unregister member from database: "+ err));
        ctx.reply("I have noted that a member has left the group and I have deleted him from this group's database");
    }
})

bot.command("checkin", async (ctx) => {
    let name = ctx.message.from.first_name; 
    if (ctx.message.chat.type == 'group' || ctx.message.chat.type == "supergroup") {
        var question = "How are you feeling 🤔"
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

bot.catch((err, ctx) => {
    console.log("The bot has encountered an error for " + ctx.updateType, err);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot;