import db from "./db";

async function findAll() {
    return await db.query(`SELECT * FROM IAMHEAR`)
}

async function findByIamhear(iamhear) {
    return await db.query(`SELECT * FROM IAMHEAR WHERE IAMHEAR = '${iamhear}'`)
}

async function findByHearnow(hearnow) {
    return await db.query(`SELECT * FROM IAMHEAR WHERE HEARNOW = '${hearnow}'`)
}

async function findByIamhearAndHearnow(iamhear, hearnow) {
    return await db.query(`SELECT * FROM IAMHEAR WHERE IAMHEAR = '${iamhear}' AND HEARNOW = '${hearnow}'`)
}

async function findByIamhearOrHearnow(id) {
    return await db.query(`SELECT * FROM IAMHEAR WHERE IAMHEAR = '${id}' OR HEARNOW = '${id}'`)
}

async function insertByIamhearAndHearnow(iamhear, hearnow) {
    await db.query(`INSERT INTO IAMHEAR VALUES ('${iamhear}', '${hearnow}') ON CONFLICT DO NOTHING`)
}

async function deleteByIamHearOrHearnow(id) {
    await db.query(`DELETE FROM IAMHEAR WHERE IAMHEAR = '${id}' OR HEARNOW = '${id}'`);
}

export default {
    findAll,
    findByIamhear,
    findByHearnow,
    findByIamhearAndHearnow,
    findByIamhearOrHearnow,
    insertByIamhearAndHearnow,
    deleteByIamHearOrHearnow
}
