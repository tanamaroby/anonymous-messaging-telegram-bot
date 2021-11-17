import { Markup } from 'telegraf';
import users from "../../services/users";

function createGroupsMenu(groups) {
    var buttons = [];
    groups.forEach(group => {
        buttons.push([Markup.button.callback(group.group_name, group.id)]);
    })
    return Markup.inlineKeyboard(buttons);
}

async function isHearnow(user) {
    return await users.isExistHearnow(user.id);
}

async function hearnow(user) {
    var userId = user.id;
    var groupIdsObjects = await users.findGroupByUserId(userId);
    if (groupIdsObjects.length > 0) {
        var groupIds = "(" + groupIdsObjects.map(groupId => groupId.group_id).join(",") + ")";
        var groups = await users.findGroupIdNameMappingByGroupIdIn(groupIds);
        return createGroupsMenu(groups);
    } else {
        return [];
    }
}

async function getGroups(selection) {
    var userIds = await users.findUserIdsByGroupId(selection);
    var result = [];
    userIds.forEach(id => result.push(id.id));
    return result;
}

async function addHearnow(user, groupId) {
    await users.insertHearnow(user.id, groupId);
}

async function cancelHearnow(user) {
    await users.deleteHearnow(user.id);
}

export default {
    hearnow,
    getGroups,
    addHearnow,
    isHearnow,
    cancelHearnow
};
