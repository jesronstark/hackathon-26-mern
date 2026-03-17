const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/login', adminController.login);
router.get('/dashboard', adminController.getDashboard);
router.get('/export-excel', adminController.exportExcel);

module.exports = router;
