const express = require("express");
const cors = require('cors');
const bookmark = require('./routes/bookmark');
const tags = require('./routes/tags');
const recipe = require('./routes/recipe');
const search = require('./routes/search');
const camera = require('./routes/camera');
const fs = require('fs');
const https = require('https');
const tesseract = require('node-tesseract');

const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));

const sslOptions = {
    key: fs.readFileSync("/var/www/certs/kitchen.local.key"),
    cert: fs.readFileSync("/var/www/certs/kitchen.local.crt")
};


https.createServer(sslOptions, app).listen(2001);


const sqlite3 = require('sqlite3').verbose();
const DB_PATH = '/var/www/kitchenapi/sqlite.db';

const DB = new sqlite3.Database(DB_PATH, function(err){
    if (err) {
        console.log(err);
        return;
    }
    console.log('Connected to ' + DB_PATH + ' database.');
});


bookmark(app,DB);
tags(app,DB);
recipe(app,DB);
search(app,DB);
camera(app,DB,fs,tesseract);




//DB.close();
