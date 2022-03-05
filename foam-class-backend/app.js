"use strict";

/** Express app for foam image classification. */

const express = require("express");
const cors = require("cors");
const imageRoutes = require("./routes/images");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/images", imageRoutes);


module.exports = app;