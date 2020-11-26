/**************************************************************************************/
module.exports = class search{

	/********************************************/
	constructor(DB) {
		this.DB = DB;
	}
	/********************************************/


	/********************************************/
	random(){
		let sql = 'select * from recipe order by random() limit 1; ';
		let temp = this.DB.prepare(sql).get();

		let data_out = [];
		data_out.push(temp);
		
		return data_out;
	}
	/********************************************/


	/********************************************/
	search(){
		let sql = 'select * from recipe ';
		let sql_where = '';
		let bind_parameters = [];

		if(this.post.recipe_name !== ''){
			bind_parameters.push('%'+this.post.recipe_name.trim()+'%');
			sql_where += 'recipe_name like ? and ';
		}
		if(this.post.ingredients !== ''){
			bind_parameters.push('%'+this.post.ingredients.trim()+'%');
			sql_where += 'ingredients like ? and ';
		}

		if(sql_where !== ''){
			sql += 'where '+sql_where;
			//cap off the where
			sql += '1 = 1 '
		}

		sql += ' order by recipe_name'

		let rows = this.DB.prepare(sql).all(bind_parameters);

		if(typeof rows === 'undefined' || rows.length < 1){
			//no match
			return [];
		}
		else{
			if(this.post.tags.length < 1){
				//no tags, so just return all the data
				return rows;
			}
			else{
				let results = [];

				for(let i = 0; i < rows.length; i++){
					let sql2 = "select * from tags_map where recipe_id = ? and ("
					let bind_parameters2 = [];
					bind_parameters2.push(rows[i].id);

					for(let x = 0; x < this.post.tags.length; x++){
						bind_parameters2.push(this.post.tags[x].id);
						if(x === 0){
							sql2 += 'tag_id = ? ';
						}
						else{
							sql2 += 'or tag_id = ?';
						}
					}
					sql2 += ')';

					let rows2 = this.DB.prepare(sql2).all(bind_parameters2);

					//the number of rows returned should equal how many tags they sent. if not, then don't include the recipe as it didnt have all the tags
					if(typeof rows2 !== 'undefined' && rows2.length === this.post.tags.length){
						results.push(rows[i]);
					}
				}
				return results;
			}
		}
	}
	/********************************************/

}
/**************************************************************************************/
