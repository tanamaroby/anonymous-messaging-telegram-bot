import users from '../../services/users';

async function register(user, chat) {
    var groupId = chat.id;
    var groupName = chat.title;
    var userId = user.id;
    var userName = user.first_name;
    var success = await users.registerUser(userId, groupId);
    await users.registerGroup(groupId, groupName);
    if (success) {
        return "Thank you " + userName + " for registering! You have registered the group " + groupName + "." + " Please /start me privately for additional features.";
    } else {
        return "Sorry but you are already registered in " + groupName + ", " + userName + "!";
    }
}

async function registerGroup(groupId, groupName) {
    await users.registerGroup(groupId, groupName);
}

async function unregister(memberId, groupId) {
    await users.deleteByUserIdAndGroupId(memberId, groupId);
}

async function unregisterGroup(groupId) {
    await users.deleteGroupIdNameMappingByGroupId(groupId);
    await users.deleteUserGroupMappingByGroupId(groupId);
}

async function updateGroup(groupId, newGroupId) {
    await users.updateGroupIdNameMappingByGroupId(groupId, newGroupId);
    await users.updateUserGroupMappingByGroupId(groupId, newGroupId);
}

export default { 
    register,
    registerGroup,
    unregister,
    unregisterGroup,
    updateGroup
};