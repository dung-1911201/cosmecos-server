const User = require('../models/userModel');
const CryptoJS = require('crypto-js');

module.exports = {
	getAllUser: () => {
		return new Promise((resolve, reject) => {
			User.find()
				.then((user) => resolve(user))
				.catch((err) => reject(err));
		});
	},
	getSingleUser: (userId) => {
		return new Promise(async (resolve, reject) => {
			try {
				const user = await User.findById({ _id: userId });
				const { password, ...subInfoUser } = user._doc;
				resolve(subInfoUser);
			} catch (error) {
				reject(error);
			}
		});
	},
	updateUser: ({ userId, data }) => {
		const hashPassword = CryptoJS.AES.encrypt(data.password, process.env.AES_SECRET).toString();
		data.password = hashPassword;
		return new Promise(async (resolve, reject) => {
			try {
				const user = await User.findOneAndUpdate({ _id: userId }, req.body, { new: true });
				const { password, ...others } = user._doc;
				resolve(others);
			} catch (error) {
				reject(error);
			}
		});
	},

	deleteUser: (userId) => {
		return new Promise(async (resolve, reject) => {
			try {
				const user = await User.findByIdAndDelete({ _id: userId });
				const { password, ...others } = user._doc;
				resolve(others);
			} catch (error) {
				reject(500).json(error);
			}
		});
	},
	userStat: () => {
		const date = new Date();
		const currentMonth = new Date(date.setMonth(date.getMonth() + 1));
		return new Promise(async (resolve, reject) => {
			try {
				const user = await User.aggregate([
					{
						$match: {
							createdAt: { $lte: currentMonth }
						}
					},
					{
						$project: {
							month: { $month: '$createdAt' }
						}
					},
					{
						$group: {
							_id: '$month',
							quantity: { $count: {} }
						}
					},
					{
						$sort: { _id: 1 }
					}
				]);
				resolve(user);
			} catch (error) {
				reject(error);
			}
		});
	}
};
