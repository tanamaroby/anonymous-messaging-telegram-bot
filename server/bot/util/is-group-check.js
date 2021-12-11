export default function isGroup(ctx) {
    return ctx.message.chat.type != 'private'
}
