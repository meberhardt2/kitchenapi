/**************************************************************************************/
const camera = (app,DB,fs,tesseract,allowed_ip) => {

	/********************************************/
	app.post('/api/camera', async (request, response) => {
		const remoteAddress = request.connection.remoteAddress;
		if(remoteAddress.includes(allowed_ip)){
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

			response.json({
				'text': text,
				'status': 'ok'
			});
		}
		else{
			response.json({'status': 'forbidden'});
		}
	});
	/********************************************/

}
/**************************************************************************************/

module.exports = camera;
