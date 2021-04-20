
/**************************************************************************************/
const bookmark = (app,DB,allowed_ip) => {

	/********************************************/
	app.post('/api/bookmark', (request, response) => {
		const remoteAddress = request.connection.remoteAddress;
		if(remoteAddress.includes(allowed_ip)){
			const Recipe = require('../classes/recipe');
			
			let recipe = new Recipe(DB);
			recipe.id = request.body.id;
			recipe.add_bookmark();

			response.json({'status': 'ok'});
		}
		else{
			response.json({'status': 'forbidden'});
		}
	});
	/********************************************/


	/********************************************/
	app.get('/api/bookmark', (request, response) => {
		const Recipe = require('../classes/recipe');
		
		let recipe = new Recipe(DB);
		let data = recipe.get_bookmark();

		response.json(data);
    });
	/********************************************/

}
/**************************************************************************************/

module.exports = bookmark;
