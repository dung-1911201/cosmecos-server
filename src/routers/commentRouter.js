const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/api/comment', commentController.createComment);
router.get('/api/comment/:productId', commentController.getAllComment);

module.exports = router;
