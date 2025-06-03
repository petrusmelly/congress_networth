const express = require('express');
const path = require('path');
// import mapboxgl from 'mapbox-gl'; // or 
// import 'dotenv/config';

require('dotenv').config();


const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// virtual path prefix
app.use('/static', express.static('public'));

app.get('/', (req, res) => {
    res.render('home', {token: process.env.MAPBOX_TOKEN});
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})