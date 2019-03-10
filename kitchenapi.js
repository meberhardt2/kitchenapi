const express = require("express");
const cors = require('cors');
const bookmark = require('./routes/bookmark');
const tags = require('./routes/tags');
const recipe = require('./routes/recipe');
const search = require('./routes/search');

const app = express();
app.use(cors());
app.use(express.json());

// app.delete('/api/v1/todos/:id', (req, res) => {
// req.params.id

app.listen(2001, () => {
	console.log("Server running on port 2001");
});




const sqlite3 = require('sqlite3').verbose();
//const DB_PATH = './sqlite.db';
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




//DB.close();
