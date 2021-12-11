import createErrorMessage from "../util/error";
import iamhearDb from '../../services/iamhear'

export default async function crisis(bot) {
    bot.command('crisis', async ctx => {
        let message = 'If you are worried about your safety. Please reach out to:\n\nSOS hotline 24hr 62214444\n\nSOS chat  https://www.sos.org.sg/contact-us\n\nIMH Crisis hotline 63892222';
        try {
            let participants = await iamhearDb.findByIamhearOrHearnow(ctx.message.from.id);
            if (participants.length > 0) { // Is currently in a conversation
                let recipient = participants[0].hearnow == ctx.message.from.id ? participants[0].iamhear : participants[0].hearnow;
                await ctx.telegram.sendMessage(recipient, message);
                await ctx.reply(`I have sent the following information to the other person\n\n${message}`);
            } else { // not in a conversation
                ctx.reply(message);
            }
        } catch (err) {
            console.log(createErrorMessage(`crisis`, ctx.message.from.username, err));
        }
    })
}