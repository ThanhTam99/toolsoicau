// server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // serve static files in the 'public' directory

// read initial data from data.js
let mangBanDau;
try {
  mangBanDau = require('./data');
  // console.log('mangBanDau:', mangBanDau);
} catch (error) {
  mangBanDau = [];
}

// serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// serve data.js
app.get('/getData', (req, res) => {
  res.json(mangBanDau);
});

// add data to array
app.post('/addData', (req, res) => {
  const newMang = req.body;
  mangBanDau.push(newMang);
  fs.writeFileSync('./data.js', `module.exports = ${JSON.stringify(mangBanDau)};`);
  res.json({ status: 'success' });
});

// reset the array
app.post('/resetData', (req, res) => {
  mangBanDau = [];
  fs.writeFileSync('./data.js', `module.exports = ${JSON.stringify(mangBanDau)};`);
  res.json({ status: 'success' });
});

app.listen(3000, () => console.log('Server listening on port 3000'));