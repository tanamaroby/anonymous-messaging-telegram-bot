import { Client } from 'pg';
import "../load-env";

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

async function query(query, params) {
    const {rows, fields} = await client.query(query, params);
    return rows;
}

export default {query};