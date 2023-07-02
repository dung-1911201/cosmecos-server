const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

module.exports = {
	login: (data) => {
		return new Promise(async (resolve, reject) => {
			console.log(data);
			try {
				const user = await User.findOne({ email: data.email });

				if (user) {
					const decryptPass = CryptoJS.AES.decrypt(user.password, process.env.AES_SECRET);
					const originPass = decryptPass.toString(CryptoJS.enc.Utf8);

					if (originPass === data.password) {
						const token = jwt.sign(
							{ userName: user.userName, isAdmin: user.isAdmin },
							process.env.JWT_TOKEN,
							{
								expiresIn: '3d'
							}
						);
						const { password, ...subInfoUser } = user._doc;
						const infoUser = { ...subInfoUser, token };
						resolve(infoUser);
					} else {
						reject('Incorrect password !');
					}
				} else {
					reject('User does not exist !');
				}
			} catch (error) {
				reject(error);
			}
		});
	},
	register: (userInfo) => {
		return new Promise((resolve, reject) => {
			const hashPassword = CryptoJS.AES.encrypt(userInfo.password, process.env.AES_SECRET).toString();
			userInfo.password = hashPassword;
			User.create(userInfo)
				.then((user) => resolve(user))
				.catch((err) => reject(err));
		});
	}
};
