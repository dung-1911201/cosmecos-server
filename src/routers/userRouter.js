const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/api/user', userController.getAllUser);
router.get('/api/user/userStat', userController.userStat);
router.get('/api/user/:id', userController.getSingleUser);
router.put('/api/user/:id', userController.updateUser);
router.delete('/api/user/:id', userController.deleteUser);

module.exports = router;
