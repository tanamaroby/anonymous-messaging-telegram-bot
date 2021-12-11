import forbiddenAction from "../util/forbidden-action";
import createErrorMessage from "../util/error";
import isGroup from "../util/is-group-check";

export default async function checkin(bot) {
    bot.command("checkin", async (ctx) => {
        try {
            if (isGroup(ctx)) {
                let question1 = `How are you feeling?`;
                let question2 = `Has your mood disrupted your school work or leisure time in the past 2 days?`;
                let answers1 = [
                    "😁 Super awesome",
                    "😀 Pretty good",
                    "😐 Okay",
                    "☹ Somewhat bad",
                    "😔 Really terrible"
                ];
                let answers2 = [
                    "😀 Not at all",
                    "😐 Mildly",
                    "☹ Moderately",
                    "😔 Extremely"
                ];
                await ctx.replyWithPoll(question1, answers1);
                await ctx.replyWithPoll(question2, answers2);
            } else {
                await ctx.reply(forbiddenAction.createGroupErrorCommand(ctx.message.from.first_name));
            }
        } catch (err) {
            console.log(createErrorMessage(`checkin`, ctx.message.from.username, err));
        }
    });
}