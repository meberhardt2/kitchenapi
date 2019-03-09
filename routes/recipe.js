
/**************************************************************************************/
const recipe = (app,DB) => {

	/********************************************/
	app.post('/api/recipe', (request, response) => {
		let post = request.body;
		let id = 0;
		let sql1 = '';
		let sql2 = '';
		let sql3 = '';

		//if this is being added as a bookmark, make sure there isnt one already. there can be only one. highlander
		if(post.bookmarked === 'y'){
			sql1 = 'update recipe set bookmarked = "n"';
		}
		else{
			//not the best way, but this will help with asynchronous chaining
			sql1 = "select 'nothing';"
		}


		DB.run(sql1, [], function(error, row) {
			if (error) {
				console.log(error)
				response.json({id: 0});
				return
			}
			else{
				sql2 = 'insert into recipe(recipe_name,recipe,bookmarked) values(?, ?, ?) ';
				DB.run(sql2, [post.recipe_name,post.recipe,post.bookmarked], function(error, row) {
					if (error) {
						console.log(error)
						response.json({id: 0});
						return
					}
					else{
						let recipe_id = this.lastID;
						let data = [];

						sql3 = 'insert into tags_map(recipe_id,tag_id)';
						for(let i = 0; i < post.tags.length; i++){
							if(i === 0){
								sql3 += ' values(?, ?)';
							}
							else{
								sql3 += ',(?, ?)';
							}
							data.push(recipe_id);
							data.push(post.tags[i].id);
						}

						DB.run(sql3, data, function(error, row) {
							if (error) {
								console.log(error)
								response.json({id: 0});
								return
							}
							else{
								response.json({id: recipe_id});
							}
						});
					}
				});
			}
		});
	});
	/********************************************/

}
/**************************************************************************************/

module.exports = recipe;
