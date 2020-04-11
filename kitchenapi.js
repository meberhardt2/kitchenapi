const express = require("express");
const cors = require('cors');
const bookmark = require('./routes/bookmark');
const tags = require('./routes/tags');
const recipe = require('./routes/recipe');
const search = require('./routes/search');
const camera = require('./routes/camera');
const upload = require('./routes/upload');
const fs = require('fs');
//const https = require('https');
const http = require('http');
const tesseract = require('node-tesseract');
const multer = require('multer');

const creds = JSON.parse(fs.readFileSync('/var/www/conf/kitchenapi.json', 'UTF-8'));

const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));

///etc/letsencrypt/live/eberhardt.cloud

/*
const sslOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/eberhardt.cloud/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/eberhardt.cloud/fullchain.pem")
};
*/

const uploadMulter = multer({ dest: '/var/www/kitchenExpress/uploads/' });

//https.createServer(sslOptions, app).listen(2001);
http.createServer(app).listen(2001);
//http.timeout = 10000;

//node-sqlite3 runs asynchronous, which leads to promise mess of chaining. better-sqlite3 runs synchronously
const DB_PATH = '/var/www/kitchenapi/sqlite.db';
const sqlite3 = require('better-sqlite3');
const DB = new sqlite3(DB_PATH);
//const DB = new sqlite3(DB_PATH, { verbose: console.log });

bookmark(app,DB);
tags(app,DB);
recipe(app,DB,creds);
search(app,DB);
camera(app,DB,fs,tesseract);
upload(app,DB,fs,tesseract,uploadMulter);



//DB.close();
