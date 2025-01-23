const express = require('express');
const db = require('./initdb');
const app = express();
app.use(express.static('public'));

function geoIP(ip) {
    const geoip = require('geoip-lite');
    const geo = geoip.lookup(ip);
    return geo;
}

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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})