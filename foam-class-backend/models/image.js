"use strict";

const db = require("../db");

/** Related functions for images. */

class Image {

    static async get(page=1, filter="all", limit=20) {
        let result;
        if(filter === "all") {
            result = await db.query(
                  `SELECT id,
                          url,
                          is_classified,
                          last_modified,
                          is_foaming 
                   FROM images
                   OFFSET ${20 * (page - 1)}
                   LIMIT ${limit}`
            );
        } else if(filter === "foaming") {
            result = await db.query(
                `SELECT id,
                        url,
                        is_classified,
                        last_modified,
                        is_foaming 
                 FROM images
                 WHERE is_foaming IS TRUE AND is_classified IS TRUE
                 OFFSET ${20 * (page - 1)}
                 LIMIT ${limit}`,
          );
        } else if(filter === "not foaming") {
            result = await db.query(
                `SELECT id,
                        url,
                        is_classified,
                        last_modified,
                        is_foaming 
                 FROM images
                 WHERE is_foaming IS FALSE AND is_classified IS TRUE
                 OFFSET ${20 * (page - 1)}
                 LIMIT ${limit}`,
            );
        } else {
            result = await db.query(
                `SELECT id,
                        url,
                        is_classified,
                        last_modified,
                        is_foaming 
                 FROM images
                 WHERE is_classified IS FALSE
                 OFFSET ${20 * (page - 1)}
                 LIMIT ${limit}`,
            );
        }
        const images = result.rows;
        return images;
    }
}


module.exports = Image;