const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true
		},
		content: {
			type: String,
			required: true
		},
		commentAt: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
