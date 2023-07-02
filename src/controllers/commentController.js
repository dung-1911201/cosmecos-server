const commentService = require('../services/commentService');

module.exports = {
	createComment: async (req, res, next) => {
		try {
			const comment = await commentService.createComment(req.body);
			res.status(200).json(comment);
		} catch (error) {
			res.status(500).json(error);
		}
	},
	getAllComment: async (req, res, next) => {
		try {
			const comments = await commentService.getAllComment(req.params.productId);
			res.status(200).json(comments);
		} catch (error) {
			res.status(500).json(error);
		}
	}
};
