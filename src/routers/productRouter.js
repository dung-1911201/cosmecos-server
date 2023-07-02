const express = require('express'); 
const router = express.Router(); 

const productController = require('../controllers/productController'); 

router.post('/api/product',productController.createProduct)
router.get('/api/product',productController.getAllProduct)
router.get('/api/product/:id',productController.getSingleProduct)
router.put('/api/product/:id',productController.updateProduct)
router.delete('/api/product/:id',productController.deleteProduct)


module.exports = router; 