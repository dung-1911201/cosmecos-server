const authService = require('../services/authService');

module.exports = {
	login: async (req, res, next) => {
		try {
			const user = await authService.login(req.body);
			res.status(200).json(user);
		} catch (error) {
			res.status(500).json(error);
		}
	},
	register: async (req, res, next) => {
		try {
			const user = await authService.register(req.body);
			res.status(200).json(user);
		} catch (error) {
			res.status(500).json(error);
		}
	}
};
