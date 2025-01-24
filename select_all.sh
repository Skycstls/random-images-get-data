#!/bin/bash

# SELECT * FROM users to usuarios.db

sqlite3 usuarios.db "SELECT * FROM usuarios;"

# SHOW TABLES

sqlite3 usuarios.db ".tables"