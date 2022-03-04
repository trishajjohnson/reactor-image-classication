"use strict";

/** Database setup for foam. */
const { Client } = require("pg");

const db = new Client({ connectionString: "foam" });

db.connect();

module.exports = db;