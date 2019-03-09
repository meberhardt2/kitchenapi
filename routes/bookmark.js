
/**************************************************************************************/
const bookmark = (app,DB) => {

	/********************************************/
	app.post('/api/bookmark', (request, response) => {
		let post = request.body;
		let out = {
			id: 0
		};

		let sql = "update recipe set bookmarked = 'n' ";

		DB.run(sql, [], function(error, rows) {
			if (error) {
				console.log(error)
				return
			}
			else{
				let sql2 = "update recipe set bookmarked = 'y' where id = ?";
				DB.get(sql2, [post.id], function(error, row) {
					if (error) {
						console.log(error)
						return
					}
							
					response.json({'ok': ''});
				});
			}
		});
	});
	/********************************************/


	/********************************************/
	app.get('/api/bookmark', (request, response) => {
		let sql = 'select * from recipe where bookmarked = ? ';
		var out = {};

		DB.get(sql, ['y'], function(error, row) {
			if (error) {
				console.log(error)
				return
			}
			
			//row is undefined if no row returned
			if(typeof row !== 'undefined'){
				out = row;
			}

			response.json(out);
		});
    });
	/********************************************/

}
/**************************************************************************************/

module.exports = bookmark;
