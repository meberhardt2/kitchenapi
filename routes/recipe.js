
/**************************************************************************************/
const recipe = (app,DB,creds,allowed_ip) => {

	/********************************************/
	app.delete('/api/recipe/:id', (request, response) => {
		const remoteAddress = request.connection.remoteAddress;
		if(remoteAddress.includes(allowed_ip)){
			const Recipe = require('../classes/recipe');
			let recipe = new Recipe(DB);

			recipe.id = request.params.id;
			recipe.delete();
			
			response.json({'status': 'ok'});
		}
		else{
			response.json({'status': 'forbidden'});
		}
	});
	/********************************************/


	/********************************************/
	app.get('/api/recipe/:id', (request, response) => {
		const Recipe = require('../classes/recipe');
		let recipe = new Recipe(DB);

		recipe.id = request.params.id;
		let data_out = recipe.get();
		
		response.json(data_out);
	});
	/********************************************/


	/********************************************/
	app.post('/api/recipe', (request, response) => {
		const remoteAddress = request.connection.remoteAddress;
		if(remoteAddress.includes(allowed_ip)){
			const Recipe = require('../classes/recipe');
			
			let recipe = new Recipe(DB);
			recipe.post = request.body;
			let id = recipe.add();

			let out = {
				id: id,
				status: 'ok'
			};
			response.json(out);
		}
		else{
			response.json({'status': 'forbidden'});
		}
	});
	/********************************************/


	/********************************************/
	app.patch('/api/recipe/:id', (request, response) => {
		const remoteAddress = request.connection.remoteAddress;
		if(remoteAddress.includes(allowed_ip)){
			const Recipe = require('../classes/recipe');
			
			let recipe = new Recipe(DB);
			recipe.post = request.body;
			recipe.id = request.params.id;
			recipe.update();

			response.json({'status': 'ok'});
		}
		else{
			response.json({'status': 'forbidden'});
		}
	});
	/********************************************/


	/********************************************/
	app.post('/api/recipe/:id/sendgrid', (request, response) => {
		const remoteAddress = request.connection.remoteAddress;
		if(remoteAddress.includes(allowed_ip)){
			const Recipe = require('../classes/recipe');
			
			let recipe = new Recipe(DB);
			recipe.creds = creds;
			recipe.id = request.params.id;
			recipe.post = request.body;
			recipe.sendgrid();

			response.json({'status': 'sent'});
		}
		else{
			response.json({'status': 'forbidden'});
		}
	});
	/********************************************/


	/********************************************/
	app.post('/api/recipe/:id/gmail', (request, response) => {
		const remoteAddress = request.connection.remoteAddress;
		if(remoteAddress.includes(allowed_ip)){
			const Recipe = require('../classes/recipe');
			
			let recipe = new Recipe(DB);
			recipe.creds = creds;
			recipe.id = request.params.id;
			recipe.post = request.body;
			recipe.gmail();

			response.json({'status': 'sent'});
		}
		else{
			response.json({'status': 'forbidden'});
		}
	});
	/********************************************/

}
/**************************************************************************************/

module.exports = recipe;
