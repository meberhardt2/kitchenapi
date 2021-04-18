/**************************************************************************************/
const camera = (app,DB,fs,tesseract) => {

	/********************************************/
	app.post('/api/camera', async (request, response) => {
		const remoteAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
		if(remoteAddress.includes("192.168.1.")){
			let file = '../kitchenExpress/uploads/for_ocr.png';
			let post = request.body;
			let bitmap = Buffer.from(post.image, 'base64');
			const Image = require('../classes/image');
			let image = new Image(DB);

			fs.writeFileSync(file, bitmap);

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

module.exports = camera;
