"use strict";

/** Database setup for foam classification app. */

const { Client } = require("pg");

const DATABASE_NAME = process.env.DATABASE_NAME || 'foamdb';

const db = new Client({ connectionString: DATABASE_NAME });

db.connect();

module.exports = db;