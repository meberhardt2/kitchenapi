/**************************************************************************************/
const search = (app,DB) => {

	/********************************************/
	app.post('/api/random', (request, response) => {
		const Search = require('../classes/search');
		let search = new Search(DB);

		let data_out = search.random();
		
		response.json(data_out);
	});	
	/********************************************/
	
		
	/********************************************/
	app.post('/api/search', (request, response) => {
		const Search = require('../classes/search');
		let search = new Search(DB);

		search.post = request.body;
		let data_out = search.search();
		
		response.json(data_out);
	});	
	
}
/**************************************************************************************/

module.exports = search;
