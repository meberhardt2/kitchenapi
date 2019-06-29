/**************************************************************************************/
const tags = (app,DB) => {

	/********************************************/
	app.get('/api/tags', (request, response) => {
		const Tag = require('../classes/tag');
		let tag = new Tag(DB);

		let data_out = tag.all();
		
		response.json(data_out);
	});
	/********************************************/


	/********************************************/
	app.post('/api/tags', (request, response) => {
		const remoteAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
		if(remoteAddress.includes("192.168.1.")){
			const Tag = require('../classes/tag');
			
			let tag = new Tag(DB);
			tag.post = request.body;
			let id = tag.add();

			let out = {
				id: id
			};
			response.json(out);
		}
	});
	/********************************************/


	/********************************************/
	app.delete('/api/tags/:id', (request, response) => {
		const remoteAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
		if(remoteAddress.includes("192.168.1.")){
			const Tag = require('../classes/tag');
			
			let tag = new Tag(DB);
			tag.id = request.params.id;
			tag.delete();

			response.json({});
		}
	});
	/********************************************/


	/********************************************/
	app.patch('/api/tags/:id', (request, response) => {
		const remoteAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
		if(remoteAddress.includes("192.168.1.")){
			const Tag = require('../classes/tag');
			
			let tag = new Tag(DB);
			tag.id = request.params.id;
			tag.post = request.body;
			tag.update();

			let out = {
				id: request.params.id,
				tag: request.body.tag
			};

			response.json(out);
		}
	});
	/********************************************/

}
/**************************************************************************************/

module.exports = tags;
