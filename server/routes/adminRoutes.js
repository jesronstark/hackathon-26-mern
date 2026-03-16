const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { adminLogin, getDashboard, exportExcel } = require('../controllers/adminController');

router.post('/login', adminLogin);
router.get('/dashboard', auth, getDashboard);
router.get('/export-excel', auth, exportExcel);

module.exports = router;
