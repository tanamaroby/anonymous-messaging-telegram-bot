function createGroupErrorCommand(name) {
    return `Apologies ${name} but this command is only available when you message me in a group.`
}

function createPrivateErrorCommand(name) {
    return `Apologies ${name} but this command is only available when you message me privately`
}

const forbiddenAction = {
    createGroupErrorCommand,
    createPrivateErrorCommand
}

export default forbiddenAction
