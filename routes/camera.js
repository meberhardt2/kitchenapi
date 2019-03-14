/**************************************************************************************/
const camera = (app,DB,fs) => {

	/********************************************/
	app.post('/api/camera', (request, response) => {
		let post = request.body;
		let bitmap = new Buffer(post.image, 'base64');
		fs.writeFileSync("/var/www/kitchenapi/uploads/for_ocr.png", bitmap);

		response.json({'status': 'ok'});
	});
	/********************************************/

}
/**************************************************************************************/

module.exports = camera;
