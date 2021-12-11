import db from "./db";

async function findByUserIdAndGroupId(userId, groupId) {
    return await db.query(`SELECT * FROM USER_GROUP_MAPPING WHERE ID = ${userId} AND GROUP_ID = ${groupId}`)
}

async function findByUserId(userId) {
    return await db.query(`SELECT * FROM USER_GROUP_MAPPING WHERE ID = ${userId}`)
}

async function findByGroupId(groupId) {
    return await db.query(`SELECT * FROM USER_GROUP_MAPPING WHERE GROUP_ID = ${groupId}`)
}

async function insertByUserIdAndGroupId(userId, groupId) {
    await db.query(`INSERT INTO USER_GROUP_MAPPING VALUES ('${userId}', '${groupId}') ON CONFLICT DO NOTHING`)
}

async function updateGroupId(prevId, newId) {
    await db.query(`UPDATE USER_GROUP_MAPPING SET GROUP_ID = '${newId}' WHERE GROUP_ID = '${prevId}'`);
}

async function deleteByGroupId(groupId) {
    await db.query(`DELETE FROM USER_GROUP_MAPPING WHERE GROUP_ID = '${groupId}'`);
}

async function deleteByUserIdAndGroupId(userId, groupId) {
    await db.query(`DELETE FROM USER_GROUP_MAPPING WHERE ID = '${userId}' AND GROUP_ID = '${groupId}'`);
}

export default {
    findByUserIdAndGroupId,
    findByUserId,
    findByGroupId,
    insertByUserIdAndGroupId,
    updateGroupId,
    deleteByGroupId,
    deleteByUserIdAndGroupId
}
