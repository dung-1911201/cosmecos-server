const mongoose = require('mongoose');

const Product = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		desc: { type: String, required: true },
		image: { type: Array, default: '' },
		price_new: { type: Number, required: true },
		price_old: { type: Number },
		inStock: { type: Number, required: true }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', Product);
