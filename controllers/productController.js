const db = require('../models');
const { Op, json } = require('sequelize');
const Product = db.Product;
const Product_category = db.Product_category;
const User = db.User;

const productController = {
  getProducts: (req, res) => {
    const status = req.query.status || 'all';
    const getProducts = (status) => {
      Product.findAll({
        where: {
          status,
        },
        include: [
          {
            model: Product_category,
          },
          {
            model: User,
          },
        ],
        order: [['id', 'DESC']],
      })
        .then((products) => {
          if (products.length !== 0) {
            console.log(JSON.stringify(products, null, 4));
            return res.status(200).json({ ok: 1, data: products });
          }
          return res.status(200).json({ ok: 0, data: '暫無商品' });
        })
        .catch((err) => {
          return res.status(500).json({ ok: 0, data: err });
        });
    };

    switch (status) {
      case 'checking':
        //0: 未審查
        getProducts(0);
        break;
      case 'passed':
        //1:已審核通過
        getProducts(1);
        break;
      case 'failed':
        //2:未通過
        getProducts(2);
        break;
      default:
        getProducts([0, 1, 2]);
    }
  },

  getCategories: (req, res) => {
    Product_category.findAll()
      .then((categories) => {
        if (categories.length !== 0) {
          return res.status(200).json({ ok: 1, data: categories });
        }
        return res.status(200).json({ ok: 0, data: '暫無分類' });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, data: err });
      });
  },

  // 只開放通過審查的商品還是說也可以指定未通過以外的商品
  getProductsFromCategory: (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
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
          include: User,
        },
      ],
      order: [['id', 'DESC']],
    })
      .then((products) => {
        if (products.length !== 0) {
          console.log(JSON.stringify(products, null, 4));
          return res.status(200).json({ ok: 1, data: products });
        }
        return res.status(200).json({ ok: 0, data: '此分類暫無商品' });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, data: err });
      });
  },

  getProductFromVender: (req, res) => {},

  // 只開放通過審查的商品還是說也可以指定未通過以外的商品
  search: (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword)
      return res.status(400).json({ ok: 0, data: 'keyword is required' });
    Product.findAll({
      where: {
        status: 1,
        name: {
          [Op.like]: `%${keyword}%`,
        },
      },
      include: [
        {
          model: Product_category,
        },
        {
          model: User,
        },
      ],
    })
      .then((products) => {
        if (products.length !== 0) {
          console.log(JSON.stringify(products, null, 4));
          return res.status(200).json({ ok: 1, data: products });
        }
        return res.status(200).json({ ok: 0, data: '查無此商品' });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, data: err });
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
        },
        {
          model: User,
        },
      ],
    })
      .then((product) => {
        console.log(JSON.stringify(product, null, 4));
        return res.status(200).json({ ok: 1, data: product });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, data: err });
      });
  },

  addProduct: (req, res) => {
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
      payment_method, // 付款方式
      remark, // 備註
    } = req.body;

    if (
      !ProductCategoryId ||
      !name ||
      !picture_url ||
      !info ||
      !price ||
      !quantity ||
      !delivery ||
      !delivery_location ||
      !delivery_time ||
      !payment_method
    ) {
      return res.status(400).json({ ok: 0, data: '資料不齊全' });
    }

    Product.create({
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
      .then((product) => {
        return res.status(200).json({
          ok: 1,
          data: {
            productId: product.id,
            status: 'success',
          },
        });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, data: err });
      });
  },

  editProductPage: (req, res) => {
    const id = req.params.id;
    product
      .findOne({
        where: {
          id,
        },
        include: Product_category,
      })
      .then((product) => {
        return res
          .status(200)
          .json({ ok: 1, data: `productId: ${product.id}` });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, data: err });
      });
  },

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
      payment_method, // 付款方式
      remark, // 備註
    } = req.body;

    if (
      !ProductCategoryId ||
      !name ||
      !picture_url ||
      !info ||
      !price ||
      !quantity ||
      !delivery ||
      !delivery_location ||
      !delivery_time ||
      !payment_method
    ) {
      return res.status(400).json({ ok: 0, data: '資料不齊全' });
    }

    Product.findByPk(id)
      .then((product) => {
        if (!product) {
          return res.status(200).json({ ok: 0, data: '查無資料' });
        }
        console.log(JSON.stringify(product, null, 4));
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
              data: {
                productId: product.id,
                status: 'success',
              },
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, data: err });
      });
  },

  deleteProduct: (req, res) => {
    const id = req.params.id;
    Product.findByPk(id)
      .then((product) => {
        if (!product) {
          return res.status(200).json({ ok: 0, data: '查無資料' });
        }
        console.log(JSON.stringify(product, null, 4));
        return product.destroy().then(() => {
          res.status(200).json({
            ok: 1,
            data: {
              productId: product.id,
              status: 'success',
            },
          });
        });
      })
      .catch((err) => {
        return res.status(500).json({ ok: 0, data: err });
      });
  },
};

module.exports = productController;
