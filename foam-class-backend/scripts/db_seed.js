const axios = require('axios');
const db = require("../db");

let url = "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/4fc14642-a3d6-424b-b621-5ecf5d955d7f/foam-seed.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220306T220027Z&X-Amz-Expires=86400&X-Amz-Signature=77e66b075ab7494505f95918a5ceaa7e0c5a6da483c947ddd68066dc257f5eb4&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22foam-seed.json%22&x-id=GetObject";

async function getJson() {
    const result = await axios.get(url);

    await db.query(
        `DROP TABLE IF EXISTS images`
    );

    await db.query(
        `CREATE TABLE images (
            id SERIAL PRIMARY KEY,
            url TEXT NOT NULL,
            is_classified BOOLEAN DEFAULT FALSE,
            last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_foaming BOOLEAN DEFAULT FALSE
            )`
    );
   
    for(let img of result.data) {
        
        await db.query(
            `INSERT INTO images (url, last_modified)
             VALUES ('${img['url']}', '${img['lastModified']}')`
        );
    }
}

getJson();
