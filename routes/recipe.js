
/**************************************************************************************/
const recipe = (app,DB,creds) => {

	/********************************************/
	app.delete('/api/recipe/:id', (request, response) => {
		const remoteAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
		if(remoteAddress.includes("192.168.1.")){
			const Recipe = require('../classes/recipe');
			let recipe = new Recipe(DB);

			recipe.id = request.params.id;
			recipe.delete();
			
			response.json({'status': 'ok'});
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
		const remoteAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
		if(remoteAddress.includes("192.168.1.")){
			const Recipe = require('../classes/recipe');
			
			let recipe = new Recipe(DB);
			recipe.post = request.body;
			let id = recipe.add();

			let out = {
				id: id
			};
			response.json(out);
		}
	});
	/********************************************/


	/********************************************/
	app.patch('/api/recipe/:id', (request, response) => {
		const remoteAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
		if(remoteAddress.includes("192.168.1.")){
			const Recipe = require('../classes/recipe');
			
			let recipe = new Recipe(DB);
			recipe.post = request.body;
			recipe.id = request.params.id;
			recipe.update();

			response.json({'status': 'ok'});
		}
	});
	/********************************************/


	/********************************************/
	app.post('/api/recipe/:id/sendgrid', (request, response) => {
		const remoteAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
		if(remoteAddress.includes("192.168.1.")){
			const Recipe = require('../classes/recipe');
			
			let recipe = new Recipe(DB);
			recipe.creds = creds;
			recipe.id = request.params.id;
			recipe.post = request.body;
			recipe.sendgrid();

			response.json({'status': 'sent'});
		}
	});
	/********************************************/


	/********************************************/
	app.post('/api/recipe/:id/gmail', (request, response) => {
		const remoteAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
		if(remoteAddress.includes("192.168.1.")){
			const Recipe = require('../classes/recipe');
			
			let recipe = new Recipe(DB);
			recipe.creds = creds;
			recipe.id = request.params.id;
			recipe.post = request.body;
			recipe.gmail();

			response.json({'status': 'sent'});
		}
	});
	/********************************************/

}
/**************************************************************************************/

module.exports = recipe;
