/**************************************************************************************/
module.exports = class recipe{
	//id

	/********************************************/
	constructor(DB) {
		this.DB = DB;
	}
	/********************************************/


	/********************************************/
	get(){
		let sql = '';
		let data_out = {};
		let tags = [];

		sql = 'select * from recipe where id = ?; ';
		data_out = this.DB.prepare(sql).get(this.id);
		
		//no matches, it will return undefined
		if(typeof data_out === 'undefined'){
			data_out = {};
		}

		sql = 'select tags.* ';
		sql += 'from tags ';
		sql += 'inner join tags_map on tags_map.tag_id = tags.id ';
		sql += 'where tags_map.recipe_id = ?;';
		tags = this.DB.prepare(sql).all(this.id);

		if(typeof tags !== 'undefined'){
			data_out.tags = tags;
		}

		return data_out;
	}
	/********************************************/


	/********************************************/
	delete(){
		let sql = 'delete from recipe where id = ?;';
		let data = this.DB.prepare(sql).run(this.id);
	}
	/********************************************/

	
	/********************************************/
	add_bookmark(){
		let sql = "update recipe set bookmarked = 'n'";
		this.DB.prepare(sql).run();

		sql = "update recipe set bookmarked = 'y' where id = ?";
		this.DB.prepare(sql).run(this.id);
	}
	/********************************************/


	/********************************************/
	get_bookmark(){
		let sql = "select * from recipe where bookmarked = 'y'";
		let rows = this.DB.prepare(sql).get();

		if(typeof rows === 'undefined' || rows.length < 1){
			return {};
		}
		else{
			return rows;
		}
	}
	/********************************************/


	/********************************************/
	add(){
		let recipe_id = 0;
		//if this is being added as a bookmark, make sure there isnt one already. there can be only one. highlander
		if(this.post.bookmarked === 'y'){
			this.DB.prepare("update recipe set bookmarked = 'n'").run();
		}

		let sql = 'insert into recipe(recipe_name,recipe,bookmarked,ingredients) values(?, ?, ?, ?) ';
		let data = this.DB.prepare(sql).run(this.post.recipe_name.toLowerCase(),this.post.recipe,this.post.bookmarked,this.post.ingredients)

		if(typeof data.lastInsertRowid === 'undefined' || data.lastInsertRowid < 1){
			recipe_id = 0;
		}
		else{
			recipe_id = data.lastInsertRowid;
		}

		//adds from the camera area only have the name and the recipe, so the tags are missing. meant to be added via laptop
		if(this.post.tags.length > 0 && recipe_id > 0){
			let bindParameters = [];
			let sql = 'insert into tags_map(recipe_id,tag_id)';

			for(let i = 0; i < this.post.tags.length; i++){
				if(i === 0){
					sql += ' values(?, ?)';
				}
				else{
					sql += ',(?, ?)';
				}
				bindParameters.push(recipe_id);
				bindParameters.push(this.post.tags[i].id);
			}

			this.DB.prepare(sql).run(bindParameters)
		}

		return recipe_id;
	}
	/********************************************/


	/********************************************/
	update(){
		//if this is being added as a bookmark, make sure there isnt one already. there can be only one. highlander
		if(this.post.bookmarked === 'y'){
			this.DB.prepare("update recipe set bookmarked = 'n'").run()
		}

		let sql = 'update recipe set recipe_name = ?, recipe = ?, bookmarked = ?, ingredients = ? where id = ?';
		this.DB.prepare(sql).run(this.post.recipe_name,this.post.recipe,this.post.bookmarked,this.post.ingredients,this.id);

		if(this.post.tags.length > 0){
			sql = 'delete from tags_map where recipe_id = ?;';
			this.DB.prepare(sql).run(this.id)

			let bindParameters = [];
			sql = 'insert into tags_map(recipe_id,tag_id)';
			for(let i = 0; i < this.post.tags.length; i++){
				if(i === 0){
					sql += ' values(?, ?)';
				}
				else{
					sql += ',(?, ?)';
				}
				bindParameters.push(this.id);
				bindParameters.push(this.post.tags[i].id);
			}

			this.DB.prepare(sql).run(bindParameters);
		}
	}
	/********************************************/


	/********************************************/
	sendgrid(){
		const sendgrid = require('@sendgrid/mail');
		let message = {};

		//request.params.id
		sendgrid.setApiKey(this.creds.sendgrid.apikey);
		message = {
			to: 'matthew.eberhardt@gmail.com',
			from: 'nowhere@redknight.net',
			subject: 'recipe from the eberhardts',
			text: 'plaintext',
			html: '<strong>email</strong>',
		};
		sendgrid.send(message);
	}
	/********************************************/


	/********************************************/
	gmail(){
		const nodemailer = require('nodemailer');
		let message = {};

		let recipe = this.get();
		let body = "Ingredients:\n" +
					recipe.ingredients+"\n\n" +
					"Recipe:\n" +
					recipe.recipe+"\n\n";

		//request.params.id
		let transporter = nodemailer.createTransport({
			host: 'smtp.googlemail.com', // Gmail Host
			port: 465, // Port
			secure: true, // this is true as port is 465
			auth: {
				user: this.creds.gmail.userAccount, //Gmail username
				pass: this.creds.gmail.applicationPassword, // Gmail password
			}
		});
	 
		let mailOptions = {
			from: '"Matt Eberhardt" <matthew.eberhardt@gmail.com>',
			to: this.post.email, // Recepient email address. Multiple emails can send separated by commas
			subject: 'Recipe from the Eberhardts',
			text: body
		};
	 
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			//console.log('Message sent: %s', info.messageId);
		});
	}
	/********************************************/
}
/**************************************************************************************/
