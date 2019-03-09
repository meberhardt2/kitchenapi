/**************************************************************************************/
const search = (app,DB) => {

	/********************************************/
	app.post('/api/search', (request, response) => {
		let post = request.body;
		let sql = 'select * from recipe ';
		let sql_where = '';
		let bind_parameters = [];
		let recipe_name = '';
		let ingredients = '';

		if(post.recipe_name !== ''){
			bind_parameters.push('%'+post.recipe_name+'%');
			sql_where += 'recipe_name like ? and ';
		}
		if(post.ingredients !== ''){
			bind_parameters.push('%'+post.ingredients+'%');
			sql_where += 'ingredients like ? and ';
		}

		if(sql_where !== ''){
			sql += 'where '+sql_where;
			//cap off the where
			sql += '1 = 1 '
		}

		DB.all(sql, bind_parameters, function(error, rows) {
			if (error) {
				console.log(error)
				return
			}
			else{
				let results = rows;
				let tag_ids = [];
				let sql2 = '';
				if(post.tags.length > 0){
					sql2 = 'select * from tags_map where ';
					for(let i = 0; i < post.tags.length; i++){
						if(i == 0){
							sql2 += 'tag_id = ? ';
						}
						else{
							sql2 += 'or tag_id = ? ';
						}
						tag_ids.push(post.tags[i].id);
					}
					sql2 += 'group by recipe_id';
				}
				else{
					sql2 = 'select * from tags_map where tag_id = 0';
				}

				DB.all(sql2, tag_ids, function(error, rows) {
					if (error) {
						console.log(error)
						return
					}
					else{
						let valid_ids = rows;

						if(post.tags.length > 0){
							let new_results = [];
							for(let x = 0; x < results.length; x++){
								for(let y = 0; y < valid_ids.length; y++){
									if(results[x].id === valid_ids[y].recipe_id){
										new_results.push(results[x]);
									}
								}
							}
							response.json(new_results);
						}
						else{
							response.json(results);
						}
					}
				});
			}
		});
	});	
	
}
/**************************************************************************************/

module.exports = search;
