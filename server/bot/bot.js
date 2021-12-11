import {Telegraf} from "telegraf";

import start from "./command/start";
import help from "./command/help";
import hellobot from "./command/hellobot";
import setup from "./command/setup";
import hearnow from "./command/hearnow";
import iamhear from './command/iamhear';
import cancelhearnow from "./command/cancelhearnow";
import crisis from "./command/crisis";
import end from "./command/end";

import conversation from "./triggers/conversation";
import checkin from "./command/checkin";
import groupCreated from "./triggers/group-created";
import migrateChat from "./triggers/migrate-chat";
import addedToGroup from "./triggers/added-to-group";
import newChatTitle from "./triggers/new-chat-title";
import memberLeave from "./triggers/member-leave";

export const bot = new Telegraf(process.env.BOT_TOKEN);
/**
 * This section represents the bot commands
 * The functions are named after the bot commands available
 * For example, the function `hellobot` corresponds to the `hellobot` command
 */
start(bot);
help(bot);
hellobot(bot);
setup(bot);
hearnow(bot);
iamhear(bot);
cancelhearnow(bot);
crisis(bot);
end(bot);
checkin(bot);

/**
 * This section represents the triggers
 * The functions corresponds a particular situation
 */
groupCreated(bot); // When the bot created with the group
migrateChat(bot); // When the group is converted to supergroup
addedToGroup(bot); // When the bot is added to the group
newChatTitle(bot); // When the group name is updated
memberLeave(bot); // When the group is delete or member leave or the bot is kicked
conversation(bot); // This is for when the users have connected to each other

bot.catch((err, ctx) => {
    console.log("The bot has encountered an error for " + ctx.updateType, err);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot;