import db from "./db";

async function findById(id) {
    return await db.query(`SELECT * FROM USER_PREFERRED_GENDER_MAPPING WHERE ID = '${id}'`)
}

async function findByPreferredGender(preferredGender) {
    return await db.query(`SELECT * FROM USER_PREFERRED_GENDER_MAPPING WHERE PREFERRED_GENDER = '${preferredGender}'`)
}

async function findByIdAndPreferredGender(id, preferredGender) {
    return await db.query(`SELECT * FROM USER_PREFERRED_GENDER_MAPPING WHERE ID = '${id}' AND PREFERRED_GENDER = '${preferredGender}'`)
}

async function insertByIdAndPreferredGender(id, preferredGender) {
    await db.query(`INSERT INTO USER_PREFERRED_GENDER_MAPPING VALUES ('${id}', '${preferredGender}') ON CONFLICT (ID) DO UPDATE SET PREFERRED_GENDER = EXCLUDED.PREFERRED_GENDER`)
}

export default {
    findById,
    findByPreferredGender,
    findByIdAndPreferredGender,
    insertByIdAndPreferredGender
}
