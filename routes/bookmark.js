
/**************************************************************************************/
const bookmark = (app,DB) => {

	/********************************************/
	app.post('/api/bookmark', (request, response) => {
		const Recipe = require('../classes/recipe');
		
		let recipe = new Recipe(DB);
		recipe.id = request.body.id;
		recipe.add_bookmark();

		response.json({'status': 'ok'});
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
