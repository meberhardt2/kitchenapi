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
const DB_PATH = './sqlite.db';

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



/*
dbSchema = `CREATE TABLE IF NOT EXISTS recipe (
	id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	recipe_name text,
	recipe text,
	bookmarked CHARACTER(1)
);

CREATE TABLE IF NOT EXISTS tags (
	id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	tag text
);

CREATE TABLE IF NOT EXISTS tags_map (
	recipe_id integer NOT NULL,
	tag_id integer NOT NULL,
	PRIMARY KEY (recipe_id, tag_id)
);
`

DB.exec(dbSchema, function(err){
	if (err) {
		console.log(err)
	}
});
*/

//DB.close();
