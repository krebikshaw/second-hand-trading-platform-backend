const express = require('express');
const orderRouter = express.Router();
const {checkAuth} = require('../middlewares/auth.js');
const orderController = require('../controllers/orderController');



//orderRouter.get('/', (req, res) => res.send('hellow')); // 測試用
// 取得全部訂單資料
orderRouter.get('/', checkAuth('isAdmin'),orderController.getAllOrders);
// 取得單一訂單明細
orderRouter.get('/:id/order', checkAuth(),orderController.getOneOrder);
// 刪除訂單資料
orderRouter.delete('/:id', checkAuth(),orderController.deleteOrder);
// 訂單取消
orderRouter.patch('/:id/cancel', checkAuth(),orderController.cancelOrder);
// 訂單完成
orderRouter.patch('/:id/complete', checkAuth(),orderController.orderComplete);
// 訂單出貨
orderRouter.patch('/:id/send', checkAuth('isVendor'),orderController.sendOrder);
// 訂單付款
orderRouter.patch('/:id/pay',  checkAuth(),orderController.payOrder);
// 取得自己賣的訂單列表	
orderRouter.get('/sell', checkAuth('isVendor'), orderController.sellOrder);
// 取得自己買的訂單列表	
orderRouter.get('/buy', checkAuth(), orderController.buyOrder);
// 成立訂單
orderRouter.post('/new', checkAuth(),orderController.newOrder);






module.exports = orderRouter;