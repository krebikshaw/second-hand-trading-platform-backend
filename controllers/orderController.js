const db = require('../models');
const Order = db.Order;
const Product = db.Product;
const User = db.User;
const Cart = db.Cart;
const Order_items = db.Order_items;
const Cart_items = db.Cart_items;
const { checkToken } = require('../middlewares/auth');

const orderController = {
 // 取得全部訂單列表
 getAllOrders: (req,res) => {
   is_admin = req.user.is_admin
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
  Order.findByPk(req.params.id)
    .then(order => {
     Order_items.findOne({
       where:{
         OrderId: order.id
       }
     })
      .then(product => {
        return res.status(200).json({ok:1,product});
      }).catch(err => console.log(err))
    })
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
  id = req.user.id
  Order.findByPk(req.params.id)
  .then(order => {
   if (id === order.client_id || id === order.seller_id)
   return order.update({is_canceled: 1});
   })
   .then(() => {
      res.status(200).json({ok:1,message: 'success'});
    })
    .catch(err => console.log(err))
  },
// 訂單完成
orderComplete: (req, res) => {
  id = req.user.id
  Order.findByPk(req.params.id)
   .then(order => {
    if (id === order.client_id)
    return order.update({is_completed: 1});
   })
   .then(() => {
      res.status(200).json({ok:1,message: 'success'});
    })
    .catch(err => console.log(err))
},
// 訂單出貨
sendOrder: (req, res) => {
  id = req.user.id
  Order.findByPk(req.params.id)
  .then(order => {
   if (id === order.seller_id)
   return order.update({is_sent: 1});
 })
  .then(() => {
      res.status(200).json({ok:1,message: 'success'});
    })
   .catch(err => console.log(err))
},
// 訂單付款
payOrder: (req, res) => {
 id = req.user.id
 Order.findByPk(req.params.id)
  .then(order => {
   if (id = order.client_id)
   return order.update({is_paid: 1});
 })
  .then(() => {
      res.status(200).json({ok:1,message: 'success'});
    })
   .catch(err => console.log(err))
 },
  // 取得自己賣的訂單列表
sellOrder: (req, res) => {
  id = req.user.id
  Order.findAll({
    where: {
      seller_id: id
    },
  })
   .then(orders => {
      res.status(200).json({ok:1,orders});
    })
     .catch(err => console.log(err))
},
// 取得自己買的訂單列表
buyOrder: (req, res) => {
  id = req.user.id
  Order.findAll({
    where: {
      client_id : id
    },
  })
    .then((orders) => {
      res.status(200).json({ok:1,orders});
     }).catch(err => console.log(err))
 },
// 成立訂單
newOrder: (req, res) => {
  // 購買人資訊
  const { client_name, client_phone, client_address } = req.body
  if (!req.body) {
     return res.status(400).send();
  };
  // 新增一張訂單 orders
  Order.create({
   client_id : req.user.id,
   client_name: 'Jo',
   client_phone: '0912121212',
   client_address: 'qqq',
   seller_id: 51,
   UserId: 51,
   id: 51
  }).then((order) => { 
  // 從購物車商品 table 裡面把資料撈出來
    Cart_items.findAll({
    where: {
      CartId : req.user.id,
    }
  })
   .then((Cart_items) => {
      Product.findAll({
        where:{
          id : Cart_items.productId
        }
      }).then((product) => {
        // 新增到訂單商品 order_items
      Order_items.create({
        productId: product.id,
      }).then(() => {
        // 同時要把要下單的購物車商品刪掉 
        Cart.findOne({
          where: {
            userId: req.user.id
          }
        }).then((Cart) => {
        Cart_items.findAll({
          where:{
            CartId : Cart.id
          }
        }).then((items) => {
          return Cart_items.update({is_empty: 1});
        }).catch(err => console.log(err))
      })
     })
    }) 
   })
  })
 }
}

module.exports = orderController;
