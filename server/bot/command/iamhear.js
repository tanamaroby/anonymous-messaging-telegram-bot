import users from "../../services/users";

async function findHearnow(user) {
    var query = "(" + (await users.findGroupByUserId(user.id)).map(groupId => groupId.group_id).join(",") + ")";
    var result = await users.getHearnowByGroupIdIn(query);
    return result;
}

async function assignIamhear(iamhear, hearnow) {
    var hearnowId = hearnow.hearnow;
    await users.deleteHearnow(hearnow.hearnow);
    await users.insertIAmHear(hearnowId, iamhear);
}

async function getIamhear(user) {
    var iamhear = await users.findIamhearByUserId(user.id);
    return iamhear;
}

async function getHearnow(user) {
    var hearnow = await users.findIamhearByHearnowId(user.id);
    return hearnow;
}

async function isTalking(user) {
    var result = await users.isUserTalking(user.id);
    return result.length > 0;
}

async function getTalking() {
    var result = await users.getTalking();
    return result;
}

async function endConversation(user) {
    var result = await users.isUserTalking(user.id);
    await users.deleteIamhear(result[0].iamhear);
    return result[0];
}

export default {
    findHearnow,
    assignIamhear,
    getIamhear,
    getHearnow,
    isTalking,
    endConversation,
    getTalking
}
