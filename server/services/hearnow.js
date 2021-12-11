import db from "./db";

async function findByHearnow(hearnow) {
    return await db.query(`SELECT * FROM HEARNOW WHERE HEARNOW = '${hearnow}'`)
}

async function findByGroupId(groupId) {
    return await db.query(`SELECT * FROM HEARNOW WHERE GROUP_ID = '${groupId}'`)
}

async function findByGroupIdIn(groupIds) {
    return await db.query(`SELECT * FROM HEARNOW WHERE GROUP_ID IN ${groupIds}`);
}

async function findByHearnowAndGroupId(hearnow, groupId) {
    return await db.query(`SELECT * FROM HEARNOW WHERE HEARNOW = '${hearnow}' AND GROUP_ID = '${groupId}'`)
}

async function insertByHearnowAndGroupId(hearnow, groupId) {
    await db.query(`INSERT INTO HEARNOW VALUES ('${hearnow}', '${groupId}') ON CONFLICT DO NOTHING`)
}

async function deleteByHearnow(hearnow) {
    await db.query(`DELETE FROM HEARNOW WHERE HEARNOW = '${hearnow}'`)
}

export default {
    findByHearnow,
    findByGroupId,
    findByHearnowAndGroupId,
    findByGroupIdIn,
    insertByHearnowAndGroupId,
    deleteByHearnow
}
