const productServices = require('../services/productService');

module.exports = {
	createProduct: async (req, res, next) => {
		try {
			const product = await productServices.createProduct(req.body);
			res.status(201).json(product);
		} catch (error) {
			next(error);
		}
	},
	getAllProduct: async (req, res, next) => {
		try {
			const products = await productServices.getAllProduct();
			res.status(200).json(products);
		} catch (error) {
			res.status(500).json(error);
		}
	},
	getSingleProduct: async (req, res, next) => {
		try {
			const product = await productServices.getSingleProduct(req.params.id);
			res.status(200).json(product);
		} catch (error) {
			res.status(500).json(error);
		}
	},
	deleteProduct: async (req, res, next) => {
		try {
			await productServices.deleteProduct(req.params.id);
			res.status(200).json('delete product success !');
		} catch (error) {
			res.status(500).json(error);
		}
	},
	updateProduct: async (req, res, next) => {
		try {
			await productServices.updateProduct({ productId: req.params.id, productUpdate: req.body });
			res.status(200).json('delete product success !');
		} catch (error) {
			res.status(500).json(error);
		}
	}
};
