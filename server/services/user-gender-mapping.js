import db from "./db";

async function findById(id) {
    return await db.query(`SELECT * FROM USER_GENDER_MAPPING WHERE ID = '${id}'`)
}

async function findByGender(gender) {
    return await db.query(`SELECT * FROM USER_GENDER_MAPPING WHERE GENDER = '${gender}'`)
}

async function findByIdAndGender(id, gender) {
    return await db.query(`SELECT * FROM USER_GENDER_MAPPING WHERE ID = '${id}' AND GENDER = '${gender}'`)
}

async function insertByIdAndGender(id, gender) {
    await db.query(`INSERT INTO USER_GENDER_MAPPING VALUES ('${id}', '${gender}') ON CONFLICT (ID) DO UPDATE SET GENDER = EXCLUDED.GENDER`)
}

export default {
    findById,
    findByGender,
    findByIdAndGender,
    insertByIdAndGender
}
