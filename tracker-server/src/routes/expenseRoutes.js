const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseControllers');

router.post('/', expenseController.createExpense); //post an entry
router.get('/', expenseController.getExpenses); //get all entries
router.put('/expenses/:id', expenseController.updateExpense); //edit an entry
router.delete('/expenses/:id', expenseController.deleteExpense); //delete an entry

router.get('/entries/:year/:month/:day', expenseController.getEntriesByDate); //get all entries by date
router.get('/expenses/:year/:month/:day', expenseController.getExpensesByDate); //get all expenses by date
router.get('/incomes/:year/:month/:day', expenseController.getIncomesByDate); // get all incomes by date

router.get('/sum/income/:year/:month/:day', expenseController.getIncomeSumByDate); //get sum of all incomes by date
router.get('/sum/expense/:year/:month/:day', expenseController.getExpenseSumByDate); //get sum of all expenses by date

router.get('/sum/incomes/:year/:month', expenseController.getIncomeSumByMonth); //get sum of all incomes by month
router.get('/sum/expenses/:year/:month', expenseController.getExpenseSumByMonth); //get sum of all expenses by month

router.get('/net-balance/:year/:month', expenseController.getMonthlyNetBalance); //get monthly net balance

router.get('/expense-summary/:year/:month', expenseController.getExpenseSummaryByCategory); //get sum and percentage of expenses by category in a month

router.get('/yearly-expenses/:year', expenseController.getYearlyMonthlyExpenses); //get expenses of all months in a year






module.exports = router;
