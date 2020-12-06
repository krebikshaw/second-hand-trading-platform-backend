const db = require("../models");
const Order = db.Order;
const { Op, Sequelize, bulkCreate } = require("sequelize");
const { Product, User, Cart, Order_items, Cart_items } = db;
const { checkToken } = require("../middlewares/auth");

const noOrderMessage = { ok: 0, message: "there is no order" };
const noOrderItemsMessage = { ok: 0, message: "there is no orderItems data" };
const failDeleteOrderItems = { ok: 0, message: "fail to delete OrderItems" };
const failToCancelOrder = { ok: 0, message: "fail to cancel Order" };
const failToCompleteOrder = { ok: 0, message: "fail to complete Order" };
const failToSendOrder = { ok: 0, message: "fail to send Order" };
const failToPaidOrder = { ok: 0, message: "fail to paid Order" };
const failToCreateNewOrder = { ok: 0, message: "fail to create new Order" };
const successMessage = { ok: 1, message: "success" };

const orderController = {
  // 取得全部訂單列表
  getAllOrders: (req, res) => {
    is_admin = req.user.is_admin;
    Order.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    })
      .then((orders) => {
        if (!orders || orders.length == 0) {
          return res.status(400).json(noOrderMessage);
        }
        return res.status(200).json({ ok: 1, data: orders });
      })
      .catch((res, err) => res.status(400).json(noOrderMessage));
  },
  // 取得單一訂單明細
  getOneOrder: (req, res) => {
    Order.findByPk(req.params.id).then((order) => {
      if (!order) return res.status(400).json(noOrderMessage);
      Order_items.findAll({
        where: {
          OrderId: order.id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "product_category_id"],
        },
      })
        .then((product) => {
          console.log(product);
          return res.status(200).json({ ok: 1, data: product });
        })
        .catch((res, err) => res.status(400).json(noOrderMessage));
    });
  },
  // 刪除訂單資料 限制是已完成的狀態才可以刪除
  deleteOrder: (req, res) => {
    is_admin = req.user.is_admin;
    Order.destroy({
      where: {
        id: req.params.id,
      },
    }).then((order) => {
      Order_items.destroy({
        where: {
          OrderId: req.params.id,
        },
      })
        .then(() => {
          if (!order) return res.status(400).json(noOrderMessage);
          return res.status(200).json(successMessage);
        })
        .catch((err) => res.status(400).json(failDeleteOrderItems));
    });
  },
  // 訂單取消
  cancelOrder: (req, res) => {
    let id = req.user.id;
    Order.findByPk(req.params.id).then((order) => {
      if (!order) return res.status(400).json(noOrderMessage);
      if (id === order.client_id || id === order.seller_id) {
        order
          .update({
            is_canceled: 1,
          })
          .then(() => {
            Order_items.findAll({
              where: {
                OrderId: order.id,
              },
              include: [
                {
                  model: Product,
                  right: true, // right join
                },
              ],
            }).then((orderItems) => {
              let orderItemData = orderItems.map((orderItem) => {
                return {
                  ProductId: orderItem.ProductId,
                  product_name: orderItem.product_name,
                  product_quantity: orderItem.product_quantity,
                  origin_quantity: orderItem.Product.quantity,
                };
              });
              console.log(orderItemData);
              const newQuantity = orderItemData.map(
                (data) => Object.values(data)[2] + Object.values(data)[3]
              );
              const productIdList = orderItemData.map(
                (data) => Object.values(data)[0]
              );
              for (let i = 0; i < newQuantity.length; i++) {
                Product.update(
                  { quantity: newQuantity[i] },
                  { where: { id: productIdList[i] } }
                )
                  .then(() => {
                    console.log("success");
                    return res.status(200).json(successMessage);
                  })
                  .catch((err) => res.status(400).json(failToCancelOrder));
              }
            });
          });
      } else {
        return res.status(400).json(idIsNotValid);
      }
    });
  },
  // 訂單完成
  orderComplete: (req, res) => {
    id = req.user.id;
    Order.findByPk(req.params.id)
      .then((order) => {
        if (id === order.client_id) {
          return order.update({ is_completed: 1 });
        } else {
          return res.status(400).json(failToCompleteOrder);
        }
      })
      .then(() => {
        res.status(200).json(successMessage);
      })
      .catch((err) => res.status(400).json(failToCompleteOrder));
  },
  // 訂單出貨
  sendOrder: (req, res) => {
    id = req.user.id;
    Order.findByPk(req.params.id)
      .then((order) => {
        if (id === order.seller_id) {
          return order.update({ is_sent: 1 });
        } else {
          return res.status(400).json(failToSendOrder);
        }
      })
      .then(() => {
        res.status(200).json({ ok: 1, message: "success" });
      })
      .catch((err) => res.status(400).json(failToSendOrder));
  },
  // 訂單付款
  payOrder: (req, res) => {
    id = req.user.id;
    Order.findByPk(req.params.id)
      .then((order) => {
        if (id === order.client_id) {
          return order.update({ is_paid: 1 });
        } else {
          return res.status(400).json(failToPaidOrder);
        }
      })
      .then(() => {
        res.status(200).json(successMessage);
      })
      .catch((err) => res.status(400).json(failToPaidOrder));
  },
  // 取得自己賣的訂單列表
  sellOrder: (req, res) => {
    id = req.user.id;
    Order.findAll({
      where: {
        seller_id: id,
      },
    })
      .then((orders) => {
        res.status(200).json({ ok: 1, data: orders });
      })
      .catch((err) => res.status(400).json(noOrderMessage));
  },
  // 取得自己買的訂單列表
  buyOrder: (req, res) => {
    id = req.user.id;
    Order.findAll({
      where: {
        client_id: id,
      },
    })
      .then((orders) => {
        if (!order) return res.status(400).json(noOrderMessage);
        res.status(200).json({ ok: 1, data: orders });
      })
      .catch((err) => res.status(400).json(noOrderMessage));
  },
  // 成立訂單
  newOrder: (req, res) => {
    // 購買商品、資訊
    const { product_quantity, ProductId, UserId } = req.body;
    if (!req.body) {
      return res.status(400).send();
    }
    //console.log(req.body)
    const productQuantityList = req.body.map((data) => Object.values(data)[0]);
    //console.log(productQuantityList)
    const ProductIdList = req.body.map((data) => Object.values(data)[1]);
    //console.log(ProductIdList)
    // 依據使用者下單的商品與數量把資料從購物車撈出來
    Cart_items.findAll({
      where: {
        CartId: req.user.id,
        ProductId: { [Op.in]: ProductIdList },
        product_quantity: { [Op.in]: productQuantityList },
      },
      include: [
        {
          model: Product,
          right: true, // right join
          include: {
            model: User,
            right: true, // right join
          },
        },
      ],
    }).then((cartItems) => {
      if (!cartItems)
        return res.status(400).json({ ok: 0, message: "invalid data" });
      //console.log(cartItems)
      let cartItemData = cartItems.map((cartItem) => {
        if (cartItem.Product.quantity < cartItem.product_quantity)
          return res
            .status(400)
            .json({ ok: 0, message: "product quantity is not enough" });
        return {
          ProductId: cartItem.Product.id,
          product_name: cartItem.Product.name,
          product_category_id: cartItem.Product.ProductCategoryId,
          product_picture_url: cartItem.Product.picture_url,
          product_info: cartItem.Product.info,
          product_quantity: cartItem.product_quantity,
          product_price: cartItem.Product.price,
          product_delivery: cartItem.Product.delivery,
          sellerId: cartItem.UserId,
          sellerName: cartItem.Product.User.username,
          sellerEmail: cartItem.Product.User.email,
          sellerAddress: cartItem.Product.User.address,
          origin_quantity: cartItem.Product.quantity,
        };
      });
      console.log(cartItemData);
      const newQuantity = cartItemData.map(
        (data) => Object.values(data)[12] - Object.values(data)[5]
      );
      //console.log(newQuantity)
      let date = new Date();
      let orderNumber =
        date.getFullYear().toString() +
        (date.getMonth() + 1).toString() +
        date.getDate().toString() +
        Math.round(Math.random() * 10000).toString();
      //console.log(orderNumber)
      // 新增訂單資料
      Order.create({
        UserId: req.user.id,
        client_id: req.user.id,
        client_name: req.user.username,
        client_email: req.user.email,
        client_address: req.user.address,
        seller_id: cartItemData[0].sellerId,
        seller_name: cartItemData[0].sellerName,
        seller_email: cartItemData[0].sellerEmail,
        seller_address: cartItemData[0].sellerAddress,
        order_number: orderNumber,
      }).then((order) => {
        let OrderId = order.id;
        //console.log(order)
        // 新增訂單商品資料
        Order_items.bulkCreate(cartItemData, {
          returning: true,
          updateOnDuplicate: ["OrderId"],
        }).then((orderItems) => {
          //console.log(orderItems)
          Order_items.update(
            { OrderId: OrderId },
            { where: { productId: { [Op.in]: ProductIdList } } }
          ).then((orderItems) => {
            // 同時把商品的數量減少
            for (let i = 0; i < newQuantity.length; i++) {
              Product.update(
                { quantity: newQuantity[i] },
                { where: { id: ProductIdList[i] } }
              ).then(() => {
                // 同時把下單的購物車商品刪掉
                Cart_items.findAll({
                  where: {
                    CartId: req.user.id,
                    ProductId: { [Op.in]: ProductIdList },
                    product_quantity: { [Op.in]: productQuantityList },
                  },
                })
                  .then((cartItems) => cartItems[i].destroy())
                  .then(() => {
                    return res
                      .status(200)
                      .json({ ok: 1, orderNumber: orderNumber });
                  })
                  .catch((err) => res.status(400).json(failToCreateNewOrder));
              });
            }
          });
        });
      });
    });
  },
};

module.exports = orderController;
