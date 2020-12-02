const db = require('../models');
const { Op, json } = require('sequelize');
const { Product, Product_category, User } = db;
const statusSwitch = (status) => {
  switch (status) {
    case 'checking':
      //0: 未審查
      status = 0;
      break;
    case 'all':
      // 全部
      status = [0, 1, 2];
      break;
    case 'failed':
      //2:未通過
      status = 2;
      break;
    default:
      //1:已審核通過
      status = 1;
  }
  return status;
};

const checkNumber = (str) => {
  let NumberRgexp = /^([1-9]\d*|[0]{1,1})$/;
  return NumberRgexp.test(str);
};

const checkInteger = (str) => {
  let IntegerRgexp = /^[0-9]*[1-9][0-9]*$/;
  return IntegerRgexp.test(str);
};

const productController = {
  // 撈取所有商品
  getProducts: (req, res) => {
    let { _offset, _limit, _sort, _status, _order } = req.query;
    let status = _status || 'passed';
    status = statusSwitch(status);

    Product.findAll({
      where: {
        status,
      },
      include: [
        {
          model: Product_category,
          attributes: ['id', 'name'],
        },
        {
          model: User,
          attributes: ['id', 'username', 'nickname'],
        },
      ],
      offset: _offset ? parseInt(_offset) : 0,
      limit: _limit ? parseInt(_limit) : 10,
      order: [[_sort || 'createdAt', _order || 'ASC']],
    })
      .then((products) => {
        if (products.length !== 0) {
          // console.log(JSON.stringify(products, null, 4));
          return res.status(200).json({ ok: 1, data: products });
        }
        return res.status(400).json({ ok: 0, message: '暫無商品' });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, message: err });
      });
  },

  // 撈取所有分類
  getCategories: (req, res) => {
    Product_category.findAll()
      .then((categories) => {
        if (categories.length !== 0) {
          return res.status(200).json({ ok: 1, data: categories });
        }
        return res.status(400).json({ ok: 0, message: '暫無分類' });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, message: err });
      });
  },

  // 撈取該分類商品並可篩選該分類商品的狀態
  getProductsFromCategory: (req, res) => {
    const id = req.params.id;
    let { _offset, _limit, _sort, _status, _order } = req.query;
    let status = _status || 'passed';
    status = statusSwitch(status);

    Product_category.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Product,
          where: {
            status,
          },
          include: [
            {
              model: User,
              attributes: ['id', 'username', 'nickname'],
            },
          ],
          offset: _offset ? parseInt(_offset) : 0,
          limit: _limit ? parseInt(_limit) : 10,
          order: [[_sort || 'createdAt', _order || 'ASC']],
        },
      ],
    })
      .then((category) => {
        if (!category)
          return res.status(400).json({ ok: 0, message: '查無此分類' });
        if (category.Products.length !== 0) {
          // console.log(JSON.stringify(category.Products, null, 4));
          return res.status(200).json({ ok: 1, data: category.Products });
        }
        return res.status(400).json({ ok: 0, message: '此分類暫無商品' });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, message: err });
      });
  },

  // 獲取該賣家商品
  getProductFromVender: (req, res) => {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({ ok: 0, message: 'params is required' });
    let { _offset, _limit, _sort, _status, _order } = req.query;
    let status = _status || 'passed';
    status = statusSwitch(status);

    User.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Product,
          where: {
            status,
          },
          include: [
            {
              model: Product_category,
              attributes: ['id', 'name'],
            },
          ],
          offset: _offset ? parseInt(_offset) : 0,
          limit: _limit ? parseInt(_limit) : 3,
          order: [[_sort || 'createdAt', _order || 'ASC']],
        },
      ],
    })
      .then((user) => {
        if (!user)
          return res.status(400).json({ ok: 0, message: '查無此賣家' });
        if (user.Products.length !== 0) {
          // console.log(JSON.stringify(user.Products, null, 4));
          return res.status(200).json({ ok: 1, data: user.Products });
        }
        return res.status(400).json({ ok: 0, message: '該賣家無其他商品' });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, message: err });
      });
  },

  // 搜尋關鍵字商品，中英都可
  searchProduct: (req, res) => {
    let { _offset, _limit, _sort, _status, _order, _keyword } = req.query;
    if (!_keyword)
      return res.status(400).json({ ok: 0, message: 'keyword is required' });

    let status = _status || 'passed';
    status = statusSwitch(status);

    Product.findAll({
      where: {
        status,
        name: {
          [Op.like]: `%${_keyword}%`,
        },
      },
      include: [Product_category, User],
      offset: _offset ? parseInt(_offset) : 0,
      limit: _limit ? parseInt(_limit) : 10,
      order: [[_sort || 'createdAt', _order || 'ASC']],
    })
      .then((products) => {
        if (products.length !== 0) {
          // console.log(JSON.stringify(products, null, 4));
          return res.status(200).json({ ok: 1, data: products });
        }
        return res.status(400).json({ ok: 0, message: '查無此商品' });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, message: err });
      });
  },

  getProduct: (req, res) => {
    const id = req.params.id;
    Product.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Product_category,
          attributes: ['id', 'name'],
        },
        {
          model: User,
          attributes: ['id', 'username', 'nickname'],
        },
      ],
    })
      .then((product) => {
        // console.log(JSON.stringify(product, null, 4));
        if (!product)
          return res.status(400).json({ ok: 0, message: '查無此商品' });
        return res.status(200).json({ ok: 1, data: product });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, message: err });
      });
  },

  addProduct: (req, res) => {
    const UserId = req.user.id;
    const {
      ProductCategoryId,
      name,
      picture_url,
      info,
      price,
      quantity,
      delivery, // 出貨方式  0:面交、1:郵寄
      delivery_location, // 出貨地點的欄位
      delivery_time, // 備貨時間的欄位
      payment_method, // 付款方式 0:貨到付款
      remark, // 備註
    } = req.body;

    if (
      !checkInteger(price) ||
      !checkInteger(quantity) ||
      !checkNumber(delivery) ||
      !checkInteger(delivery_time) ||
      !checkNumber(payment_method)
    ) {
      return res.status(400).json({ ok: 0, message: '欄位格式不符' });
    }

    if (
      !UserId ||
      !ProductCategoryId ||
      !name ||
      !picture_url ||
      !info ||
      !delivery_location ||
      !ProductCategoryId.trim() ||
      !name.trim() ||
      !picture_url.trim() ||
      !info.trim() ||
      !delivery_location.trim()
    ) {
      return res.status(400).json({ ok: 0, message: '資料不齊全' });
    }

    User.findByPk(UserId)
      .then((user) => {
        if (user.status === 1)
          return res.status(404).json({ ok: 0, message: '您已停權' });
        Product.create({
          UserId,
          ProductCategoryId,
          name,
          picture_url,
          info,
          price,
          quantity,
          delivery,
          delivery_location,
          delivery_time,
          payment_method,
          remark,
        })
          .then((_) => {
            return res.status(200).json({
              ok: 1,
              message: 'success',
            });
          })
          .catch((err) => {
            return res.status(500).json({ ok: 0, message: err });
          });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, message: err });
      });
  },

  //賣家可編輯自己的商品
  editProduct: (req, res) => {
    const id = req.params.id;
    const {
      ProductCategoryId,
      name,
      picture_url,
      info,
      price,
      quantity,
      delivery, // 出貨方式  0:面交、1:郵寄
      delivery_location, // 出貨地點的欄位
      delivery_time, // 備貨時間的欄位
      payment_method, // 付款方式 0:貨到付款
      remark, // 備註
    } = req.body;

    if (
      !checkInteger(price) ||
      !checkInteger(quantity) ||
      !checkNumber(delivery) ||
      !checkInteger(delivery_time) ||
      !checkNumber(payment_method)
    ) {
      return res.status(400).json({ ok: 0, message: '欄位格式不符' });
    }

    if (
      !UserId ||
      !ProductCategoryId ||
      !name ||
      !picture_url ||
      !info ||
      !delivery_location ||
      !ProductCategoryId.trim() ||
      !name.trim() ||
      !picture_url.trim() ||
      !info.trim() ||
      !delivery_location.trim()
    ) {
      return res.status(400).json({ ok: 0, message: '資料不齊全' });
    }

    Product.findByPk(id)
      .then((product) => {
        if (!product) {
          return res.status(400).json({ ok: 0, message: '查無資料' });
        }

        if (product.UserId !== req.user.id) {
          return res.status(400).json({ ok: 0, message: 'permission denied' });
        }
        // console.log(JSON.stringify(product, null, 4));
        return product
          .update({
            ProductCategoryId,
            name,
            picture_url,
            info,
            price,
            quantity,
            delivery,
            delivery_location,
            delivery_time,
            payment_method,
            remark,
          })
          .then(() => {
            res.status(200).json({
              ok: 1,
              message: 'success',
            });
          })
          .catch((err) => {
            return res.status(500).json({ ok: 0, message: err });
          });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, message: err });
      });
  },

  //賣家可刪除自己商品
  deleteProduct: (req, res) => {
    const id = req.params.id;
    Product.findByPk(id)
      .then((product) => {
        if (!product) {
          return res.status(400).json({ ok: 0, message: '查無資料' });
        }

        if (product.UserId !== req.user.id) {
          return res.status(400).json({ ok: 0, message: 'permission denied' });
        }
        // console.log(JSON.stringify(product, null, 4));
        return product
          .destroy()
          .then(() => {
            res.status(200).json({
              ok: 1,
              message: 'success',
            });
          })
          .catch((err) => {
            return res.status(500).json({ ok: 0, message: err });
          });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, message: err });
      });
  },
};

module.exports = productController;
