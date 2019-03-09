/**************************************************************************************/
const tags = (app,DB) => {

	/********************************************/
	app.get('/api/tags', (request, response) => {
		let sql = 'select * from tags order by tag ';
		let out = [];

		DB.all(sql, [], function(error, rows) {
			if (error) {
				console.log(error)
				return
			}

			out = rows;
			response.json(out);
		});
	});
	/********************************************/


	/********************************************/
	app.post('/api/tags', (request, response) => {
		let post = request.body;
		let out = {
			id: 0
		};

		let sql = 'insert into tags(tag) values(?); ';

		DB.run(sql, [post.new_tag], function(error, rows) {
			if (error) {
				console.log(error)
				return
			}
			else{
				out = {
					id: this.lastID
				};
			}

			response.json(out);
		});
	});
	/********************************************/


	/********************************************/
	app.delete('/api/tags/:id', (request, response) => {
		let out = {};
		let sql = 'delete from tags where id = ?; ';

		DB.run(sql, [request.params.id], function(error, rows) {
			if (error) {
				console.log(error)
				return
			}

			response.json(out);
		});
	});
	/********************************************/


	/********************************************/
	app.patch('/api/tags/:id', (request, response) => {
		let post = request.body;
		let out = {};
		let sql = 'update tags set tag = ? where id = ?; ';

		DB.run(sql, [post.tag,request.params.id], function(error, rows) {
			if (error) {
				console.log(error)
				return
			}

			out = {
				id: request.params.id,
				tag: post.tag
			};
			
			response.json(out);
		});
	});
	/********************************************/

}
/**************************************************************************************/

module.exports = tags;
