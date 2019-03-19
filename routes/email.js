/**************************************************************************************/
const email = (app,DB,creds) => {

	/********************************************/
	app.post('/api/sendgrid', (request, response) => {
		const sendgrid = require('@sendgrid/mail');
		let message = {};

		sendgrid.setApiKey(creds.sendgrid.apikey);
		message = {
			to: 'matthew.eberhardt@gmail.com',
			from: 'nowhere@redknight.net',
			subject: 'recipe from the eberhardts',
			text: 'plaintext',
			html: '<strong>email</strong>',
		};
		sendgrid.send(message);

		response.json({'status': 'sent'});
	});
	/********************************************/


	/********************************************/
	app.post('/api/gmail', (request, response) => {
		const nodemailer = require('nodemailer');
		let message = {};

		let transporter = nodemailer.createTransport({
			host: 'smtp.googlemail.com', // Gmail Host
			port: 465, // Port
			secure: true, // this is true as port is 465
			auth: {
				user: creds.gmail.userAccount, //Gmail username
				pass: creds.gmail.applicationPassword, // Gmail password
			}
		});
	 
		let mailOptions = {
			from: '"Matt Eberhardt" <matthew.eberhardt@gmail.com>',
			to: 'matthew.eberhardt@gmail.com', // Recepient email address. Multiple emails can send separated by commas
			subject: 'Welcome Email',
			text: 'This is the email sent through Gmail SMTP Server.'
		};
	 
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			//console.log('Message sent: %s', info.messageId);

			response.json({'status': 'sent'});
		});

	});
	/********************************************/

}
/**************************************************************************************/

module.exports = email;
