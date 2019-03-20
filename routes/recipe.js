
/**************************************************************************************/
const recipe = (app,DB,creds) => {

	/********************************************/
	app.delete('/api/recipe/:id', (request, response) => {
		let sql = 'delete from recipe where id = ?; ';

		DB.run(sql, [request.params.id], function(error, row) {
			if (error) {
				console.log(error)
				return
			}

			let sql2 = 'delete from tags_map where recipe_id = ?; ';
			DB.run(sql2, [request.params.id], function(error, row) {
				if (error) {
					console.log(error)
					return
				}
				response.json({'status': 'ok'});
			});
		});
	});
	/********************************************/


	/********************************************/
	app.get('/api/recipe/:id', (request, response) => {
		let out = {};
		let sql = 'select * from recipe where id = ?; ';

		DB.get(sql, [request.params.id], function(error, row) {
			if (error) {
				console.log(error)
				return
			}

			//row is undefined if no row returned
			if(typeof row !== 'undefined'){
				out = row;
			}

			let sql2 = 'select tags.* ';
			sql2 += 'from tags ';
			sql2 += 'inner join tags_map on tags_map.tag_id = tags.id ';
			sql2 += 'where tags_map.recipe_id = ?;';
			DB.all(sql2, [request.params.id], function(error, rows) {
				if (error) {
					console.log(error)
					return
				}
				
				//row is undefined if no row returned
				if(typeof rows !== 'undefined'){
					out.tags = rows;
				}
				else{
					out.tags = [];
				}
	
				response.json(out);
			});
		});
	});
	/********************************************/


	/********************************************/
	app.post('/api/recipe', (request, response) => {
		let post = request.body;
		let id = 0;
		let sql1 = '';
		let sql2 = '';
		let sql3 = '';

		//if this is being added as a bookmark, make sure there isnt one already. there can be only one. highlander
		if(post.bookmarked === 'y'){
			sql1 = 'update recipe set bookmarked = "n"';
		}
		else{
			//not the best way, but this will help with asynchronous chaining
			sql1 = "select 'nothing';"
		}


		DB.run(sql1, [], function(error, row) {
			if (error) {
				console.log(error)
				response.json({id: 0});
				return
			}
			else{
				sql2 = 'insert into recipe(recipe_name,recipe,bookmarked,ingredients) values(?, ?, ?, ?) ';
				DB.run(sql2, [post.recipe_name,post.recipe,post.bookmarked,post.ingredients], function(error, row) {
					if (error) {
						console.log(error)
						response.json({id: 0});
						return
					}
					else{
						let recipe_id = this.lastID;
						let data = [];
						
						//adds from the camera area only have the name and the recipe, so the tags are missing. meant to be added via laptop
						if(post.tags.length > 0){
							sql3 = 'insert into tags_map(recipe_id,tag_id)';
							for(let i = 0; i < post.tags.length; i++){
								if(i === 0){
									sql3 += ' values(?, ?)';
								}
								else{
									sql3 += ',(?, ?)';
								}
								data.push(recipe_id);
								data.push(post.tags[i].id);
							}

							DB.run(sql3, data, function(error, row) {
								if (error) {
									console.log(error)
									response.json({id: 0});
									return
								}
								else{
									response.json({id: recipe_id});
								}
							});
						}
						else{
							response.json({id: recipe_id});
						}
					}
				});
			}
		});
	});
	/********************************************/


	/********************************************/
	app.patch('/api/recipe/:id', (request, response) => {
		let post = request.body;
		let sql1 = '';
		let sql2 = '';
		let sql3 = '';
		let sql4 = '';

		//if this is being added as a bookmark, make sure there isnt one already. there can be only one. highlander
		if(post.bookmarked === 'y'){
			sql1 = 'update recipe set bookmarked = "n"';
		}
		else{
			//not the best way, but this will help with asynchronous chaining
			sql1 = "select 'nothing';"
		}


		DB.run(sql1, [], function(error, row) {
			if (error) {
				console.log(error)
				response.json({id: 0});
				return
			}
			else{
				sql2 = 'update recipe set recipe_name = ?, recipe = ?, bookmarked = ?, ingredients = ? where id = ?; ';
				DB.run(sql2, [post.recipe_name,post.recipe,post.bookmarked,post.ingredients,request.params.id], function(error, row) {
					if (error) {
						console.log(error)
						response.json({id: 0});
						return
					}
					else{
						let recipe_id = request.params.id;
						let data = [];
						
						sql3 = 'delete from tags_map where recipe_id = ?;';
						DB.run(sql3, [recipe_id], function(error, row) {
							if (error) {
								console.log(error)
								response.json({id: 0});
								return
							}
							else{
								sql4 = 'insert into tags_map(recipe_id,tag_id)';
								for(let i = 0; i < post.tags.length; i++){
									if(i === 0){
										sql4 += ' values(?, ?)';
									}
									else{
										sql4 += ',(?, ?)';
									}
									data.push(recipe_id);
									data.push(post.tags[i].id);
								}

								DB.run(sql4, data, function(error, row) {
									if (error) {
										console.log(error)
										response.json({id: 0});
										return
									}
									else{
										response.json({'status': 'ok'});
									}
								});
							}
						});
					}
				});
			}
		});
	});
	/********************************************/


	/********************************************/
	app.post('/api/recipe/:id/sendgrid', (request, response) => {
		const sendgrid = require('@sendgrid/mail');
		let message = {};

		//request.params.id
		sendgrid.setApiKey(creds.sendgrid.apikey);
		message = {
			to: 'matthew.eberhardt@gmail.com',
			from: 'nowhere@redknight.net',
			subject: 'recipe from the eberhardts',
			text: 'plaintext',
			html: '<strong>email</strong>',
		};
		sendgrid.send(message);

		response.json({'status': 'sent'});
	});
	/********************************************/


	/********************************************/
	app.post('/api/recipe/:id/gmail', (request, response) => {
		const nodemailer = require('nodemailer');
		let message = {};

		//request.params.id
		let transporter = nodemailer.createTransport({
			host: 'smtp.googlemail.com', // Gmail Host
			port: 465, // Port
			secure: true, // this is true as port is 465
			auth: {
				user: creds.gmail.userAccount, //Gmail username
				pass: creds.gmail.applicationPassword, // Gmail password
			}
		});
	 
		let mailOptions = {
			from: '"Matt Eberhardt" <matthew.eberhardt@gmail.com>',
			to: 'matthew.eberhardt@gmail.com', // Recepient email address. Multiple emails can send separated by commas
			subject: 'Welcome Email',
			text: 'This is the email sent through Gmail SMTP Server.'
		};
	 
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			//console.log('Message sent: %s', info.messageId);

			response.json({'status': 'sent'});
		});

	});
	/********************************************/

}
/**************************************************************************************/

module.exports = recipe;
