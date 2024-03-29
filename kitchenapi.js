const express = require("express");
const cors = require('cors');
const bookmark = require('./routes/bookmark');
const tags = require('./routes/tags');
const recipe = require('./routes/recipe');
const search = require('./routes/search');
const camera = require('./routes/camera');
const upload = require('./routes/upload');
const fs = require('fs');
const tesseract = require('node-tesseract');
const multer = require('multer');
const ip = require('my-local-ip')();
const creds = JSON.parse(fs.readFileSync(__dirname+'/../conf/kitchenapi.json', 'UTF-8'));
const allowed_ip = ip.replace(/(?:\.\d+){1}$/, '');     //only allow devices on the same network (local) to make updates

var os = require( 'os' );
var networkInterfaces = os.networkInterfaces();

const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));


if(ip.includes("10.192.106")){
    const http = require('http');
    http.createServer(app).listen(2004);
}
else{
    const https = require('https');
    const sslOptions = {
        key: fs.readFileSync("/etc/letsencrypt/live/eberhardt.cloud/privkey.pem"),
        cert: fs.readFileSync("/etc/letsencrypt/live/eberhardt.cloud/fullchain.pem")
    };
    https.createServer(sslOptions, app).listen(2004);
}


const uploadMulter = multer({ dest: __dirname+'/kitchenExpress/uploads/' });


//node-sqlite3 runs asynchronous, which leads to promise mess of chaining. better-sqlite3 runs synchronously
const DB_PATH = __dirname+'/sqlite.db';
const sqlite3 = require('better-sqlite3');
const DB = new sqlite3(DB_PATH);
//const DB = new sqlite3(DB_PATH, { verbose: console.log });

bookmark(app,DB,allowed_ip);
tags(app,DB,allowed_ip);
recipe(app,DB,creds,allowed_ip);
search(app,DB);
camera(app,DB,fs,tesseract,allowed_ip);
upload(app,DB,fs,tesseract,uploadMulter,allowed_ip);



//DB.close();
