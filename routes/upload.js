/**************************************************************************************/
const upload = (app,DB,fs,tesseract,uploadMulter) => {

	/********************************************/
	app.post('/api/upload', uploadMulter.single('imagefile'), async (request, response) => {
		const tempPath = request.file.path;
		const file = '/var/www/kitchen/uploads/for_ocr.jpg';

		fs.renameSync(tempPath, file);

		const Image = require('../classes/image');
		let image = new Image(DB);
		image.file = file;
		image.tesseract = tesseract;

		let promise = new Promise((resolve, reject) => {
			let text_out = image.process();
			
			resolve(text_out);
		});
		
		let text = await promise;

		response.json({'text': 'dd'});
	});
	/********************************************/

}
/**************************************************************************************/

module.exports = upload;
