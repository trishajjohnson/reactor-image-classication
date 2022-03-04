"use strict";

/** Routes for images. */

const express = require("express");

const Image = require("../models/image");

const router = express.Router();


/** GET / => { images }
 *
 * Returns { id, isFoaming (initialized to false), hasBeenReviewed (initialized to false) url, lastModified }
 *
 **/

 router.get("/", async function (req, res, next) {
    try {
      const result = await Image.get();
      console.log("result", result);
      return res.json({ result });
    } catch (err) {
      return next(err);
    }
  });


  module.exports = router;