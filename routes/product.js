const express = require('express'); 
const router = express.Router();
const authenticateToken = require("../middlewares/auth");


const { getProducts, getProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/productController');
//const {getProduct} = require("../controllers/productController");

router.get('/products',authenticateToken, getProducts);
router.get('/product/:id',authenticateToken, getProduct);
router.post('/product',authenticateToken, createProduct);
router.put('/product/:id',authenticateToken, updateProduct);
router.delete('/product/:id',authenticateToken,  deleteProduct);

module.exports = router;