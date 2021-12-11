export default function createErrorMessage(command, username, error) {
    return `Unable to process the command: ${command} when replying to ${username} with the error message: ${error}`
}
