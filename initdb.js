const betterSQLite = require('better-sqlite3');
const fs = require('fs');

const db = betterSQLite('usuarios.db');

const createTable = db.prepare('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, ip TEXT, userAgent TEXT, date TEXT, location TEXT)');
createTable.run();

module.exports = db;