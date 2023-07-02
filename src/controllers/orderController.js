const orderService = require('../services/orderService');
// const {senMail} = require('../services/orderService')

module.exports = {
	getOrderByUserId: async (req, res, next) => {
		try {
			const orders = await orderService.getOrderByUserId(req.body);
			res.status(200).json(orders);
		} catch (error) {
			res.status(500).json(error);
		}
	},
	createOrder: async (req, res, next) => {
		try {
			const order = await orderService.createOrder(req.body);
			res.status(200).json(order);
		} catch (error) {
			console.log('error: ', error);
			res.status(500).json(error);
		}
	},
	getAllOrder: async (req, res, next) => {
		try {
			const orders = await orderService.getAllOrder();
			res.status(200).json(orders);
		} catch (error) {
			res.status(500).json(error);
		}
	},
	updateOrder: async (req, res, next) => {
		try {
			const order = await orderService.updateOrder({ orderId: req.params.orderId, data: req.body });
			res.status(200).json(order);
		} catch (error) {
			res.status(500).json(error);
		}
	},
	deleteOrder: async (req, res, next) => {
		try {
			await orderService.deleteOrder(req.params.id);
			res.status(200).json('delete order success !');
		} catch (error) {
			res.status(500).json(error);
		}
	},
	orderStat: async (req, res, next) => {
		try {
			const order = await orderService.orderStat();
			res.status(200).json(order);
		} catch (error) {
			res.status(500).json(error);
		}
	},
	orderIncome: async (req, res, next) => {
		try {
			const { percent, sumThisMonth } = await orderService.orderIncome();
			res.status(200).json({ percent, sumThisMonth });
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	},
	countOrderReturn: async (req, res, next) => {
		try {
			const { returnThisMonth, percent } = await orderService.countOrderReturn();
			res.status(200).json({ returnThisMonth, percent });
		} catch (error) {
			res.status(500).json(error);
		}
	},
	compareOrder: async (req, res, next) => {
		try {
			const { orderSuccess, orderCancelled } = await orderService.compareOrder();
		} catch (error) {
			res.status(500).json(error);
		}
	},
	exportToExcel: async (req, res, next) => {
		try {
			const data = await orderService.exportToExcel(req.body);
			res.status(200).json(data);
		} catch (error) {
			res.status(500).json(error);
		}
	}
};
