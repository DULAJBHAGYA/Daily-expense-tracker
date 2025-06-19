const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseControllers');

router.post('/', expenseController.createExpense);
router.get('/', expenseController.getExpenses);

module.exports = router;
