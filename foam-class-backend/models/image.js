"use strict";

const db = require("../db");

/** Related functions for images. 
 * 
 *  Get all images, with optional filter, 
 *  limit and page params for filtering 
 *  images.
 * 
 *  Update images when classifying an image.
 *  Image can be foaming, not foaming or 
 *  unclassified.
 * 
*/

class Image {

    static async get(filter="all", limit=20, page=1) {
        let result;
        if(filter === "all") {
            result = await db.query(
                  `SELECT id,
                          url,
                          is_classified AS "isClassified",
                          last_modified AS "lastModified",
                          is_foaming AS "isFoaming" 
                   FROM images
                   ORDER BY id ASC
                   OFFSET ${20 * (page - 1)}
                   LIMIT ${limit}`
            );

            let allImages = await db.query(
                `SELECT id
                 FROM images`
            );
            result.total = allImages.rows.length;
        } else if(filter === "foaming") {
            result = await db.query(
                `SELECT id,
                        url,
                        is_classified AS "isClassified",
                        last_modified AS "lastModified",
                        is_foaming AS "isFoaming"
                 FROM images
                 WHERE is_foaming IS TRUE AND is_classified IS TRUE
                 ORDER BY id ASC
                 OFFSET ${20 * (page - 1)}
                 LIMIT ${limit}`,
            );
            let filteredImages = await db.query(
                `SELECT id
                FROM images
                WHERE is_foaming IS TRUE AND is_classified IS TRUE`
            );
            result.total = filteredImages.rows.length;
        } else if(filter === "not foaming") {
            result = await db.query(
                `SELECT id,
                        url,
                        is_classified AS "isClassified",
                        last_modified AS "lastModified",
                        is_foaming AS "isFoaming" 
                 FROM images
                 WHERE is_foaming IS FALSE AND is_classified IS TRUE
                 ORDER BY id ASC
                 OFFSET ${20 * (page - 1)}
                 LIMIT ${limit}`,
            );
            let filteredImages = await db.query(
                `SELECT id
                FROM images
                WHERE is_foaming IS FALSE AND is_classified IS TRUE`
            );
            result.total = filteredImages.rows.length;
        } else {
            result = await db.query(
                `SELECT id,
                        url,
                        is_classified AS "isClassified",
                        last_modified AS "lastModified",
                        is_foaming AS "isFoaming" 
                 FROM images
                 WHERE is_classified IS FALSE
                 ORDER BY id ASC
                 OFFSET ${20 * (page - 1)}
                 LIMIT ${limit}`,
            );
            let filteredImages = await db.query(
                `SELECT id
                FROM images
                WHERE is_classified IS FALSE`
            );
            
            result.total = filteredImages.rows.length;
        }
        
        result.page = page;
        result.limit = limit;
        result.filter = filter;
        return result;
    }

    static async updateImage(id, updateMsg) {
        let result;
        if(updateMsg === "foaming") {
            result = await db.query(
                `UPDATE images 
                 SET is_foaming=TRUE, 
                    is_classified=TRUE,
                    last_modified=CURRENT_TIMESTAMP 
                 WHERE id = ${id}
                 RETURNING id,
                           url,
                           is_classified AS "isClassified",
                           last_modified AS "lastModified",
                           is_foaming AS "isFoaming"`);
        } else {
            result = await db.query(
                `UPDATE images 
                 SET is_foaming=FALSE, 
                    is_classified=TRUE,
                    last_modified=CURRENT_TIMESTAMP 
                 WHERE id = ${id}
                 RETURNING id,
                           url,
                           is_classified AS "isClassified",
                           last_modified AS "lastModified",
                           is_foaming AS "isFoaming"`);
        }
        return result.rows[0];
    }
}


module.exports = Image;