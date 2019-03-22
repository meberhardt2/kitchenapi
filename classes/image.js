/**************************************************************************************/
module.exports = class image{
	//id

	/********************************************/
	constructor(DB) {
		this.DB = DB;
	}
	/********************************************/


	/********************************************/
	async ocr(){
		//until the tesseract node module is update, it's not compatable with node 10+, so the fix is:
		//https://github.com/desmondmorris/node-tesseract/issues/57
		let tesseract = this.tesseract;
		let file = this.file;

		let promise = new Promise((resolve, reject) => {		
			tesseract.process(file, (err, text) => {
				if(err){
					return console.log("An error occured: ", err);
				}
			
				// the text variable contains the recognized text
				//console.log(text);
				resolve(text);
			});
		});

		let result = await promise;
		
		return result;
	}
	/********************************************/


	/********************************************/
	async process(){
		let text = '';

		let promise = new Promise((resolve, reject) => {
			let ocr_text = this.ocr();				
			resolve(ocr_text);
		});
		text = await promise;

		return text;
	}
	/********************************************/
}
/**************************************************************************************/
