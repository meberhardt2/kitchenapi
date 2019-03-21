/**************************************************************************************/
module.exports = class tag{

	/********************************************/
	constructor(DB) {
		this.DB = DB;
	}
	/********************************************/


	/********************************************/
	all(){
		let sql = 'select * from tags order by tag; ';
		let data_out = this.DB.prepare(sql).all();

		return data_out;
	}
	/********************************************/
	

	/********************************************/
	add(){
		let sql = 'insert into tags(tag) values(?);';
		let data = this.DB.prepare(sql).run(this.post.new_tag);

		if(typeof data.lastInsertRowid === 'undefined' || data.lastInsertRowid < 1){
			return 0;
		}
		else{
			return data.lastInsertRowid;
		}
	}
	/********************************************/
	

	/********************************************/
	delete(){
		let sql = 'delete from tags where id = ?;';
		let data = this.DB.prepare(sql).run(this.id);
	}
	/********************************************/


	/********************************************/
	update(){
		let sql = 'update tags set tag = ? where id = ?;';
		let data = this.DB.prepare(sql).run(this.post.tag,this.id);
	}
	/********************************************/
}
/**************************************************************************************/
