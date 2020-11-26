const express = require('express');
const productRouter = express.Router();
const { checkAuth } = require('../middlewares/auth');
const productController = require('../controllers/productController');

productRouter.get('/', productController.getProducts);
productRouter.get('/categories', productController.getCategories);
// productRouter.get('/test', checkAuth(), (req, res) => {
//   console.log(req.user);
// });
productRouter.get('/categories/:id', productController.getProductsFromCategory);
productRouter.get('/vendor/:id', productController.getProductFromVender);
productRouter.get('/search', productController.search);
productRouter.get('/:id', productController.getProduct);
productRouter.post('/new', productController.addProduct);
productRouter.patch('/:id', productController.editProduct);
productRouter.delete('/:id', productController.deleteProduct);

module.exports = productRouter;
