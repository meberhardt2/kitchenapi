
/**************************************************************************************/
const bookmark = (app,DB) => {

	/********************************************/
	app.get('/api/bookmark', (request, response) => {
		let sql = 'select * from recipe where bookmarked = ? ';
		let out = {};

		DB.get(sql, ['y'], function(error, row) {
			if (error) {
				console.log(error)
				return
			}
			
			//row is undefined if no row returned
			if(typeof row !== undefined){
				out = row;
			}

			response.json(out);
		});
    });
	/********************************************/

}
/**************************************************************************************/

module.exports = bookmark;
