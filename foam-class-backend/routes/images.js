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
      const {page, filter, limit} = req.query;
      console.log("req.query", req.query);
      console.log("filter, limit, page", filter, limit, page);
      const images = await Image.get(filter, limit, page);
      
      return res.json({ images });
    } catch (err) {
      return next(err);
    }
  });


/** PATCH / => { image }
 *
 * Returns { updatedImage }
 *
 **/

 router.patch("/", async function (req, res, next) {
    try {
      const { id, updateMsg } = req.body;
      console.log("id, msg", id, updateMsg); 
      const image = await Image.updateImage(id, updateMsg);

      return res.json({ image });
    } catch (err) {
      return next(err);
    }
  });


  module.exports = router;