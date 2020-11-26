const express = require('express');
const orderRouter = express.Router();
const checkAuth = require('../middlewares/auth');
const orderController = require('../controllers/orderController');



//orderRouter.get('/', (req, res) => res.send('hellow')); // 測試用
// 取得全部訂單資料
orderRouter.get('/', orderController.getAllOrders);
// 取得單一訂單明細
orderRouter.get('/:id', orderController.getOneOrder);
// 刪除訂單資料
orderRouter.delete('/:id', orderController.deleteOrder);
// 訂單取消
orderRouter.patch('/:id/cancel', orderController.cancelOrder);
// 訂單完成
orderRouter.patch('/:id/complete', orderController.orderComplete);
// 訂單出貨
orderRouter.patch('/:id/send', orderController.sendOrder);
// 訂單付款
orderRouter.patch('/:id/pay',  orderController.payOrder);
// 成立訂單
orderRouter.post('/new', orderController.newOrder);
// 取得自己買的訂單列表	
orderRouter.get('/buy', orderController.buyOrder);
// 取得自己賣的訂單列表	
//orderRouter.get('/sell', orderController.sellOrder);




module.exports = orderRouter;