const express = require('express');
const morgan = require('morgan');
const geoip = require('geoip-lite');
const db = require('./initdb');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8000;
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('combined', { stream: logStream }));

app.get('/', (req, res) => {
    res.send('Bienvenido a la API de gatitos, envia una peticion GET a /gatitos para obtener una imagen aleatoria.');
});

app.get('/gatitos', (req, res) => {
    //recopila datos del cliente
    const ip = req.ip;
    const userAgent = req.get('User-Agent');
    const date = new Date().toISOString();
    const location = geoIP(ip);
    
    //inserta datos en la base de datos
    const insert = db.prepare('INSERT INTO usuarios (ip, userAgent, date) VALUES (?, ?, ?)');
    insert.run(ip, userAgent, date);

    const gatitos = [
        "1.jpeg",
        "2.jpeg",
        "3.jpeg",
        "4.jpeg",
        "5.jpeg"
    ];
    
    const random = Math.floor(Math.random() * gatitos.length);
    const gatito = gatitos[random];
    res.sendFile(`${__dirname}/${gatito}`);
});

app.get('/usuarios', (req, res) => {
    const password = req.query.password;
    if (password !== '123456') {
        res.status(401).send('Unauthorized');
        return;
    }
    const usuarios = db.prepare('SELECT * FROM usuarios').all();
    res.json(usuarios);
});

app.post("/collect", (req, res) => {
    const data = req.body;
    console.log(data);
    res.send(data);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})