const nodemailer = require('nodemailer');
module.exports = {
	sendMail: async (req, res) => {
		const { email } = req.body;
		try {
			var transporter = nodemailer.createTransport({
				service: 'hotmail',
				auth: {
					user: 'dungkieu002@gmail.com',
					pass: process.env.PASS_EMAIL
				}
			});

			var options = {
				from: 'dungkieu002@gmail.com',
				to: email.toString(),
				subject: 'Dung app shop phản hồi',
				html: `Cảm ơn bạn đã đặt hàng, chúng tôi sẽ kiểm tra và chuyển hàng cho bạn trong thời gian sớm nhất !`
			};
			transporter.sendMail(options, function (err, info) {
				if (err) {
					console.log(err);
					res.status(500).json('Có lỗi xảy ra khi gửi email.');
				} else {
					console.log('Email sent: ' + info.response);
					res.status(200).json('Gửi email thành công.');
				}
			});
		} catch (error) {
			console.log('error: ', error);
			res.status(500).json('Có lỗi xảy ra.');
		}
	}
};
