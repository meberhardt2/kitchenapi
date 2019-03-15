/**************************************************************************************/
const camera = (app,DB,fs,tesseract) => {

	/********************************************/
	app.post('/api/camera', (request, response) => {
		let file = '/var/www/kitchen/uploads/for_ocr.png';
		let post = request.body;
		let bitmap = Buffer.from(post.image, 'base64');

		fs.writeFileSync(file, bitmap);


		//until the tesseract node module is update, it's not compatable with node 10+, so the fix is:
		//https://github.com/desmondmorris/node-tesseract/issues/57
		tesseract.process(file, (err, text) => {
			if(err){
				return console.log("An error occured: ", err);
			}
		
			// the text variable contains the recognized text
			//console.log("Recognized text:");
			//console.log(text);
			response.json({'text': text});
		});

	});
	/********************************************/

}
/**************************************************************************************/

module.exports = camera;
