import db from './db';

async function isExistRegisteredUser(userId, groupId) {
    const userExists = await db.query('SELECT EXISTS (SELECT TRUE FROM USER_GROUP_MAPPING WHERE USER_GROUP_MAPPING.ID = ' + userId + ' AND USER_GROUP_MAPPING.GROUP_ID = ' + groupId + ')');
    return userExists[0].exists;
}

async function registerUser(userId, groupId) {
    if (await isExistRegisteredUser(userId, groupId)) {
        return false;
    } else {
        await db.query('INSERT INTO USER_GROUP_MAPPING VALUES (' + userId + ', ' + groupId + ') ON CONFLICT DO NOTHING');
        return true;
    }
}

async function isExistHearnow(userId) {
    const userExists = await db.query("SELECT EXISTS (SELECT TRUE FROM HEARNOW WHERE HEARNOW.HEARNOW = " + userId + ")");
    return userExists[0].exists;
}

async function registerGroup(groupId, groupName) {
    await db.query ("INSERT INTO GROUP_ID_NAME_MAPPING VALUES (" + groupId + ", '" + groupName + "') ON CONFLICT (ID) DO UPDATE SET GROUP_NAME = EXCLUDED.GROUP_NAME");
}

async function setupGender(userId, gender) {
    await db.query("INSERT INTO USER_GENDER_MAPPING VALUES (" + userId + ", '" + gender + "') ON CONFLICT (ID) DO UPDATE SET GENDER = EXCLUDED.GENDER");
}

async function setupPreferredGender(userId, preferredGender) {
    await db.query("INSERT INTO USER_PREFERRED_GENDER_MAPPING VALUES (" + userId + ", '" + preferredGender + "') ON CONFLICT (ID) DO UPDATE SET PREFERRED_GENDER = EXCLUDED.PREFERRED_GENDER");
}

async function findGroupByUserId(userId) {
    var result = await db.query("SELECT GROUP_ID FROM USER_GROUP_MAPPING WHERE ID = " + userId);
    return result;
}

async function findGroupIdNameMappingByGroupIdIn(groupIds) {
    var result = await db.query("SELECT * FROM GROUP_ID_NAME_MAPPING WHERE ID IN " + groupIds);
    return result;
}

async function findGroupNameByGroupId(groupId) {
    var result = await db.query("SELECT GROUP_NAME FROM GROUP_ID_NAME_MAPPING WHERE ID = " + groupId);
    return result;
}

async function findUserIdsByGroupId(groupId) {
    var result = await db.query("SELECT ID FROM USER_GROUP_MAPPING WHERE GROUP_ID = " + groupId);
    return result;
}

async function findIamhearByUserId(userId) {
    var result = await db.query("SELECT * FROM IAMHEAR WHERE IAMHEAR = " + userId);
    return result;
}

async function findIamhearByHearnowId(userId) {
    var result = await db.query("SELECT * FROM IAMHEAR WHERE HEARNOW = " + userId);
    return result;
}

async function isUserTalking(userId) {
    var result = await db.query("SELECT * FROM IAMHEAR WHERE HEARNOW = " + userId + " OR IAMHEAR = " + userId);
    return result;
}

async function insertHearnow(userId, groupId) {
    await db.query("INSERT INTO HEARNOW VALUES ('" + userId + "', '" + groupId + "') ON CONFLICT DO NOTHING");
}

async function insertIAmHear(hearnowId, iAmHearId) {
    await db.query("INSERT INTO IAMHEAR VALUES ('" + iAmHearId + "', '" + hearnowId + "') ON CONFLICT DO NOTHING");
}

async function deleteHearnow(hearnowId) {
    await db.query("DELETE FROM HEARNOW WHERE HEARNOW = " + hearnowId);
}

async function deleteIamhear(iamhearId) {
    await db.query("DELETE FROM IAMHEAR WHERE IAMHEAR = " + iamhearId);
}

async function getHearnowByGroupIdIn(groupIds) {
    var result = await db.query("SELECT * FROM HEARNOW WHERE GROUP_ID IN " + groupIds);
    return result;
}

async function getTalking() {
    var result = await db.query("SELECT * FROM IAMHEAR");
    return result;
}

async function deleteByUserIdAndGroupId(userId, groupId) {
    await db.query("DELETE FROM USER_GROUP_MAPPING WHERE ID = " + userId + " AND GROUP_ID = " + groupId);
}

async function deleteUserGroupMappingByGroupId(groupId) {
    await db.query("DELETE FROM USER_GROUP_MAPPING WHERE GROUP_ID = " + groupId);
}

async function deleteGroupIdNameMappingByGroupId(groupId) {
    await db.query("DELETE FROM GROUP_ID_NAME_MAPPING WHERE ID = " + groupId);
}

async function updateUserGroupMappingByGroupId(groupId, newGroupId) {
    await db.query("UPDATE USER_GROUP_MAPPING SET GROUP_ID = " + newGroupId + " WHERE GROUP_ID = " + groupId);
}

async function updateGroupIdNameMappingByGroupId(groupId, newGroupId) {
    await db.query("UPDATE GROUP_ID_NAME_MAPPING SET ID = " + newGroupId + " WHERE ID = " + groupId);
}

export default { 
    registerUser, 
    registerGroup, 
    setupGender, 
    setupPreferredGender, 
    findGroupByUserId, 
    findGroupIdNameMappingByGroupIdIn, 
    insertHearnow, 
    insertIAmHear,
    findUserIdsByGroupId,
    isExistRegisteredUser,
    isExistHearnow,
    getHearnowByGroupIdIn,
    deleteHearnow,
    findIamhearByUserId,
    findIamhearByHearnowId,
    deleteIamhear,
    isUserTalking,
    getTalking,
    deleteByUserIdAndGroupId,
    deleteGroupIdNameMappingByGroupId,
    deleteUserGroupMappingByGroupId,
    updateGroupIdNameMappingByGroupId,
    updateUserGroupMappingByGroupId,
    findGroupNameByGroupId
};
