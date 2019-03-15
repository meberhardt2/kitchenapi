/**************************************************************************************/
const camera = (app,DB,fs) => {

	/********************************************/
	app.post('/api/camera', (request, response) => {
		let post = request.body;
		let bitmap = Buffer.from(post.image, 'base64');
		
		fs.writeFileSync("/var/www/kitchen/uploads/for_ocr.png", bitmap);

		response.json({'status': 'ok'});
	});
	/********************************************/

}
/**************************************************************************************/

module.exports = camera;
