import userGenderMapping from "../../services/user-gender-mapping";
import userPreferredGenderMapping from "../../services/user-preferred-gender-mapping";
import isGroup from "../util/is-group-check";
import forbiddenAction from "../util/forbidden-action";
import createErrorMessage from "../util/error";
import {Markup} from "telegraf";
import constants from "../constants";

const genderMenu = Markup.inlineKeyboard([
    Markup.button.callback('Male', constants.Gender.MALE),
    Markup.button.callback('Female', constants.Gender.FEMALE),
    Markup.button.callback('Others', constants.Gender.ANYONE)
]);

const preferredGenderMenu = Markup.inlineKeyboard([
    Markup.button.callback('Male', constants.PreferredGender.MALE),
    Markup.button.callback('Female', constants.PreferredGender.FEMALE),
    Markup.button.callback('No preference', constants.PreferredGender.ANYONE)
])

export default async function setup(bot) {
    // When users first used the command setup
    bot.command(`setup`, async ctx => {
        try {
            if (isGroup(ctx)) {
                await ctx.reply(forbiddenAction.createPrivateErrorCommand(ctx.message.from.first_name))
            } else {
                await ctx.reply(`Select your gender: `, genderMenu)
            }
        } catch (err) {
            console.log(createErrorMessage(`setup`, ctx.message.from.username, err))
        }
    })

    // After user has selected their gender
    bot.action([constants.Gender.MALE, constants.Gender.FEMALE, constants.Gender.ANYONE], async (ctx) => {
        try {
            await userGenderMapping.insertByIdAndGender(ctx.callbackQuery.from.id, ctx.callbackQuery.data)
            ctx.answerCbQuery()
            ctx.editMessageText(`You have selected ${ctx.callbackQuery.data} as your gender`)
            ctx.reply(`When you use you command /hearnow, I will send anonymous conversation requests to all your group members so that they can chat with you privately and anonymously if they are available. Which gender would you prefer this listening ear be?`, preferredGenderMenu)
        } catch (err) {
            console.log(createErrorMessage(`setup`, ctx.callbackQuery.from.username, err))
        }
    });

    // After user has selected their preferred gender
    bot.action([constants.PreferredGender.MALE, constants.PreferredGender.FEMALE, constants.PreferredGender.ANYONE], async (ctx) => {
        try {
            await userPreferredGenderMapping.insertByIdAndPreferredGender(ctx.callbackQuery.from.id, ctx.callbackQuery.data)
            ctx.answerCbQuery()
            ctx.editMessageText(`You stated that you ${ctx.callbackQuery.data} for a listening ear. Note that we will still match you with anyone when there are not enough people. You will be notified of their gender and will have the option to terminate the chat.`)
            ctx.reply(`Thanks for setting up your profile! Feel free to use the /hearnow command to chat with someone from your registered groups.`)
        } catch (err) {
            console.log(createErrorMessage(`setup`, ctx.callbackQuery.from.username, err))
        }
    });
}
