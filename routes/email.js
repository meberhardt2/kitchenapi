/**************************************************************************************/
const email = (app,DB,creds) => {

	/********************************************/
	app.post('/api/email', (request, response) => {
		const sendgrid = require('@sendgrid/mail');

		sendgrid.setApiKey(creds.sendgrid.apikey);
		
		const message = {
			to: 'matthew.eberhardt@gmail.com',
			from: 'matthew.eberhardt@gmail.com',
			subject: 'recipe from the eberhardts',
			text: 'plaintext',
			html: '<strong>email</strong>',
		};
		sendgrid.send(message);

		response.json({'status': 'sent'});
	});
	/********************************************/

}
/**************************************************************************************/

module.exports = email;
