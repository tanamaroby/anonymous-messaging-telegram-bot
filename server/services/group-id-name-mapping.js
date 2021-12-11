import db from "./db";

async function findById(id) {
    return await db.query(`SELECT * FROM GROUP_ID_NAME_MAPPING WHERE ID = ${id}`)
}

async function findByIdIn(ids) {
    return await db.query(`SELECT * FROM GROUP_ID_NAME_MAPPING WHERE ID IN ${ids}`)
}

async function findByGroupName(groupName) {
    return await db.query(`SELECT * FROM GROUP_ID_NAME_MAPPING WHERE GROUP_NAME = '${groupName}'`)
}

async function findByIdAndGroupName(id, groupName) {
    return await db.query(`SELECT * FROM GROUP_ID_NAME_MAPPING WHERE ID = ${id} AND GROUP_NAME = '${groupName}'`)
}

async function insertByIdAndGroupName(id, groupName) {
    await db.query(`INSERT INTO GROUP_ID_NAME_MAPPING VALUES (${id}, '${groupName}') ON CONFLICT (ID) DO UPDATE SET GROUP_NAME = EXCLUDED.GROUP_NAME`)
}

async function updateId(prevId, newId) {
    await db.query(`UPDATE GROUP_ID_NAME_MAPPING SET ID = '${newId}' WHERE ID = '${prevId}'`);
}

async function updateName(id, newName) {
    await db.query(`UPDATE GROUP_ID_NAME_MAPPING SET GROUP_NAME = '${newName}' WHERE ID = '${id}'`);
}

async function deleteById(id) {
    await db.query(`DELETE FROM GROUP_ID_NAME_MAPPING WHERE ID = '${id}'`);
}

export default {
    findById,
    findByIdIn,
    findByGroupName,
    findByIdAndGroupName,
    insertByIdAndGroupName,
    updateId,
    updateName,
    deleteById
}
