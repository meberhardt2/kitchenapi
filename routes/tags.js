/**************************************************************************************/
const tags = (app,DB,allowed_ip) => {

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
		const remoteAddress = request.connection.remoteAddress;
		if(remoteAddress.includes(allowed_ip)){
			const Tag = require('../classes/tag');
			
			let tag = new Tag(DB);
			tag.post = request.body;
			let id = tag.add();

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
	app.delete('/api/tags/:id', (request, response) => {
		const remoteAddress = request.connection.remoteAddress;
		if(remoteAddress.includes(allowed_ip)){
			const Tag = require('../classes/tag');
			
			let tag = new Tag(DB);
			tag.id = request.params.id;
			tag.delete();

			response.json({status: 'ok'});
		}
		else{
			response.json({'status': 'forbidden'});
		}
	});
	/********************************************/


	/********************************************/
	app.patch('/api/tags/:id', (request, response) => {
		const remoteAddress = request.connection.remoteAddress;
		if(remoteAddress.includes(allowed_ip)){
			const Tag = require('../classes/tag');
			
			let tag = new Tag(DB);
			tag.id = request.params.id;
			tag.post = request.body;
			tag.update();

			let out = {
				id: request.params.id,
				tag: request.body.tag,
				status: 'ok'
			};

			response.json(out);
		}
		else{
			response.json({'status': 'forbidden'});
		}
	});
	/********************************************/

}
/**************************************************************************************/

module.exports = tags;
