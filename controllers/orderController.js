const db = require('../models');
const Order = db.Order;
const User = db.User;
const Order_item = db.Order_item;
const Car_items = db.Car_items;
const { checkToken } = require('../middlewares/auth');

const orderController = {
 // 取得全部訂單列表
 getAllOrders: (req,res) => {
   Order.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
   })
   .then((orders) => {
     if (!orders || orders.length == 0) {
        return res.status(404).end()
     }
      return res.status(200).json({ok:1,orders});
   }).catch(err => console.log(err));
 },
 // 取得單一訂單明細
getOneOrder: (req,res) => {
  Order.destroy({
      where: {
        id: req.query.userId,
    },
  })
    .then(order => {
      return res.status(200).json({ok:1,order});
    }).catch(err => console.log(err))
  },
// 刪除訂單資料
deleteOrder: (req,res) => {
  Order.findByPk(req.params.id)
   .then(order => {
     return order.destroy()
   })
    .then(() => {
      res.status(200).json({ok:1,message: 'success'});
    })
    .catch(err => console.log(err))
},
// 訂單取消
cancelOrder: (req, res) => {
  Order.findByPk(req.params.id)
  .then(order => {
   return order.update({is_canceled: 1});
   })
   .then(() => {
      res.status(200).json({ok:1,message: 'success'});
    })
    .catch(err => console.log(err))
  },
// 訂單完成
orderComplete: (req, res) => {
  Order.findByPk(req.params.id)
   .then(order => {
    return order.update({is_completed: 1});
   })
   .then(() => {
      res.status(200).json({ok:1,message: 'success'});
    })
    .catch(err => console.log(err))
},
// 訂單出貨
sendOrder: (req, res) => {
  Order.findByPk(req.params.id)
  .then(order => {
   return order.update({is_sent: 1});
 })
  .then(() => {
      res.status(200).json({ok:1,message: 'success'});
    })
   .catch(err => console.log(err))
},
// 訂單付款
payOrder: (req, res) => {
 Order.findByPk(req.params.id)
  .then(order => {
   return order.update({is_paid: 1});
 })
  .then(() => {
      res.status(200).json({ok:1,message: 'success'});
    })
   .catch(err => console.log(err))
 },
// 成立訂單
newOrder: (req, res) => {
  const { client_name, client_phone, client_address } = req.body
  if (!req.body) {
     return res.status(400).send();
  }
  // 購物車沒東西也不能送訂單
  // 新增一張訂單 orders
  Order.create({
   client_name,
   client_phone,
   client_address,
   UserId: 4,
   client_id:4,
   id:4,
   seller_id: 4
  }).then((order) => { 
  // 有訂單之後，把購物車商品新增成這張訂單的訂單商品 order_items
    res.status(200).json({ok:1,message: 'success'});
  // 同時要把要下單的購物車商品從購物車裡刪掉 cart_items
   })  
    .catch(err => console.log(err))
},
 // 取得自己買的訂單列表
/*buyOrder: (req, res) => {
  const username = checkToken(req) || '';  
  if (!username) return res.status(400).json({"ok":0,"data":"missing token"});
  Order.findAll({
    where: {
      client_id: req.user.id
    },
  })
    .then((orders) => {
      res.status(200).json({ok:1,orders});
     }).catch(err => console.log(err))
 },*/
 // 取得自己賣的訂單列表
/*sellOrder: (req, res) => {
  Order.findAll({
    where: {
        seller_id: req.query.userId
    }
  })
   .then(orders => {
      const orders = {
        ok,
        data
      }
      return res.status(200).json(result);
   }).catch(err => console.log(err))
},*/

}

module.exports = orderController;
