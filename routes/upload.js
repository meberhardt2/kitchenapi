/**************************************************************************************/
const upload = (app,DB,fs,tesseract,uploadMulter) => {

	/********************************************/
	app.post('/api/upload', uploadMulter.single('imagefile'), async (request, response) => {
		const remoteAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
		if(remoteAddress.includes("192.168.1.")){
			//imagefile is the name of the formfield that has the image
			//multer can also take an array of files
			const tempPath = request.file.path;
			const file = '/var/www/kitchenExpress/uploads/for_ocr.jpg';

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

			response.json({'text': text});
		}
	});
	/********************************************/

}
/**************************************************************************************/

module.exports = upload;
