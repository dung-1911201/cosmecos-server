const nodemailer = require('nodemailer');
const xlsx = require('xlsx');
const path = require('path');
const Order = require('../models/orderModel');
// const { resolve4 } = require('dns/promises');

module.exports = {
	getOrderByUserId: (data) => {
		return new Promise((resolve, reject) => {
			Order.find({ userId: data.id })
				.then((order) => resolve(order))
				.catch((err) => reject(err));
		});
	},
	createOrder: (data) => {
		return new Promise((resolve, reject) => {
			Order.create(data)
				.then((order) => {
					resolve(order);
				})
				.catch((err) => reject(err));
		});
	},
	getAllOrder: () => {
		return new Promise((resolve, reject) => {
			Order.find()
				.then((order) => resolve(order))
				.catch((err) => reject(err));
		});
	},
	updateOrder: ({ orderId, data }) => {
		return new Promise((resolve, reject) => {
			Order.findByIdAndUpdate({ _id: orderId }, data, {
				new: true
			})
				.then((order) => resolve(order))
				.catch((err) => reject(err));
		});
	},
	deleteOrder: (orderId) => {
		return new Promise((resolve, reject) => {
			Order.findByIdAndDelete({ _id: orderId })
				.then((order) => resolve(order))
				.catch((err) => reject(err));
		});
	},
	orderStat: () => {
		const date = new Date();
		const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
		const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));
		return new Promise((resolve, reject) => {
			Order.aggregate([
				{
					$match: { createdAt: { $gte: previousMonth } }
				},
				{
					$project: {
						month: { $month: '$createdAt' }
					}
				},
				{
					$group: {
						_id: '$month',
						total: { $count: {} }
					}
				},
				{
					$sort: { _id: 1 }
				}
			])
				.then((order) => resolve(order))
				.catch((err) => reject(err));
		});
	},
	orderIncome: () => {
		return new Promise(async (resolve, reject) => {
			try {
				const date = new Date();
				const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
				const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));

				const order = await Order.aggregate([
					{
						$match: {
							createdAt: { $gte: previousMonth },
							isPaid: true
						}
					},
					{
						$project: {
							month: { $month: '$createdAt' },
							totalOrder: 1
						}
					},
					{
						$group: {
							_id: '$month',
							totalMonney: { $sum: '$totalOrder' }
						}
					},
					{
						$sort: { _id: 1 }
					}
				]);
				let sumThisMonth;
				let sumLastMonth;
				if (order.length < 2 && order.length >= 0) {
					sumLastMonth = 0;
					sumThisMonth = 0;
				} else {
					sumThisMonth = order[1].totalMonney;
					sumLastMonth = order[0].totalMonney;
				}
				const percent = ((sumThisMonth - sumLastMonth) / sumLastMonth) * 100;
				resolve({ percent, sumThisMonth });
			} catch (error) {
				reject(error);
			}
		});
	},
	countOrderReturn: () => {
		const date = new Date();
		const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
		const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));
		return new Promise(async (resolve, reject) => {
			try {
				const order = await Order.aggregate([
					{
						$match: {
							status: 'Cancelled',
							createdAt: {
								$gte: previousMonth
							}
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
				let returnPrevMonth;
				let returnThisMonth;
				let percent;

				if (order.length === 0) {
					returnPrevMonth = 0;
					returnThisMonth = 0;
				} else if (order.length === 1) {
					returnPrevMonth = 0;
					returnThisMonth = order[0].quantity;
					percent = 100;
				} else {
					returnPrevMonth = order[0].quantity;
					returnThisMonth = order[1].quantity;
					percent = ((returnThisMonth - returnPrevMonth) / returnPrevMonth) * 100;
				}

				resolve({ returnThisMonth, percent });
			} catch (error) {
				reject(error);
			}
		});
	},
	compareOrder: () => {
		const date = new Date();
		const currentMonth = new Date(date.setMonth(date.getMonth() + 1));
		return new Promise(async (resolve, reject) => {
			try {
				const orderSuccess = await Order.aggregate([
					{
						$match: {
							status: 'Success',
							createdAt: {
								$lte: currentMonth
							}
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
							totalSuccess: { $count: {} }
						}
					},
					{
						$sort: { _id: 1 }
					}
				]);

				const orderCancelled = await Order.aggregate([
					{
						$match: {
							status: 'Cancelled',
							createdAt: {
								$lte: currentMonth
							}
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
							totalCancelled: { $count: {} }
						}
					},
					{
						$sort: {
							_id: 1
						}
					}
				]);

				resolve({ orderSuccess, orderCancelled });
			} catch (error) {
				reject(error);
			}
		});
	},
	exportToExcel: async (data) => {
		const orders = data;
		return new Promise((resolve, reject) => {
			try {
				const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
					const workBook = xlsx.utils.book_new();
					const workSheetData = [workSheetColumnNames, ...data];
					const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
					xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
					xlsx.writeFile(workBook, path.join('/Users/kieudung/Desktop', filePath));
				};

				const exportUsersToExcel = (orders, workSheetColumnNames, workSheetName, filePath) => {
					const data = orders.map((order) => {
						return [
							order._id,
							order.userName,
							order.email,
							order.orderDate,
							order.methodPay,
							order.status,
							order.totalOrder
						];
					});
					exportExcel(data, workSheetColumnNames, workSheetName, filePath);
				};

				const workSheetColumnName = [
					'ID',
					'UserName',
					'Email',
					'OrderDate',
					'MethodPay',
					'Status',
					'TotalOrder'
				];

				const filePath = './fileExportToExcelWithNodejs.xlsx';
				const workSheetName = 'Order';
				exportUsersToExcel(orders, workSheetColumnName, workSheetName, filePath);
				resolve({ message: 'export to excel success !' });
			} catch (error) {
				reject(error);
			}
		});
	}
};
