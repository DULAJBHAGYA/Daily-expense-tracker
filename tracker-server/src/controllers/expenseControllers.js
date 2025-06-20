const Expense = require('../models/expense');

// Create new expense
exports.createExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get entries by specific date
exports.getEntriesByDate = async (req, res) => {
  try {
    const { year, month, day } = req.params;

    if (!year || !month || !day) {
      return res.status(400).json({ message: "Year, month and day are required as params" });
    }

    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const entries = await Expense.find({
      date: { $gte: start, $lte: end }
    }).sort({ date: -1 });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get "expense" category in a specific date
exports.getExpensesByDate = async (req, res) => {
  try {
    const { year, month, day } = req.params;

    if (!year || !month || !day) {
      return res.status(400).json({ message: "Year, month and day are required as params" });
    }

    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const expenses = await Expense.find({
      type: "expense",
      date: { $gte: start, $lte: end }
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get "income" category in a specific date
exports.getIncomesByDate = async (req, res) => {
  try {
    const { year, month, day } = req.params;

    if (!year || !month || !day) {
      return res.status(400).json({ message: "Year, month and day are required as params" });
    }

    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const expenses = await Expense.find({
      type: "income",
      date: { $gte: start, $lte: end }
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all sum of incomes by month
exports.getIncomeSumByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required as params" });
    }

    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));

    const result = await Expense.aggregate([
      {
        $match: {
          type: "income",
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
        },
      },
    ]);

    res.json({ totalIncome: result[0]?.totalIncome || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all sum of expenses by month
exports.getExpenseSumByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required as params" });
    }

    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));

    const result = await Expense.aggregate([
      {
        $match: {
          type: "expense",
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);

    res.json({ totalExpense: result[0]?.totalExpense || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get sum of all incomes by date
exports.getIncomeSumByDate = async (req, res) => {
  try {
    const { year, month, day } = req.params;

    if (!year || !month || !day) {
      return res.status(400).json({ message: "Year, month, and day are required" });
    }

    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const result = await Expense.aggregate([
      {
        $match: {
          type: "income",
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" }
        }
      }
    ]);

    res.json({ totalIncome: result[0]?.totalIncome || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get sum of all expenses by date
exports.getExpenseSumByDate = async (req, res) => {
  try {
    const { year, month, day } = req.params;

    if (!year || !month || !day) {
      return res.status(400).json({ message: "Year, month, and day are required" });
    }

    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const result = await Expense.aggregate([
      {
        $match: {
          type: "expense",
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" }
        }
      }
    ]);

    res.json({ totalExpense: result[0]?.totalExpense || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get monthly net balance
exports.getMonthlyNetBalance = async (req, res) => {
  try {
    const { year, month } = req.params;

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required" });
    }

    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0)); // next month start

    const result = await Expense.aggregate([
      {
        $match: {
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: "$type", // group by 'income' or 'expense'
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    result.forEach(item => {
      if (item._id === "income") totalIncome = item.totalAmount;
      else if (item._id === "expense") totalExpense = item.totalAmount;
    });

    const netBalance = totalIncome - totalExpense;

    res.json({ totalIncome, totalExpense, netBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//get sum & percentage of expenses by category in a month
exports.getExpenseSummaryByCategory = async (req, res) => {
  try {
    const { year, month } = req.params;

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required" });
    }

    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0)); // next month start

    const categories = [
      'food', 'transport', 'bills', 'entertainment',
      'medicine', 'clothing', 'sanitary', 'others'
    ];

    // Aggregate total expenses for the month to calculate percentages later
    const totalResult = await Expense.aggregate([
      {
        $match: {
          type: "expense",
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    const totalAmount = totalResult[0]?.totalAmount || 0;

    // Aggregate sum by category
    const categoryResult = await Expense.aggregate([
      {
        $match: {
          type: "expense",
          date: { $gte: start, $lt: end },
          category: { $in: categories }
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    // Prepare response with all categories including those with zero expenses
    const summary = categories.map(cat => {
      const found = categoryResult.find(item => item._id === cat);
      const sum = found ? found.total : 0;
      const percentage = totalAmount ? ((sum / totalAmount) * 100).toFixed(2) : "0.00";

      return {
        category: cat,
        sum,
        percentage: parseFloat(percentage)
      };
    });

    res.json({
      totalAmount,
      summary
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get expenses of all months in a year
exports.getYearlyMonthlyExpenses = async (req, res) => {
  try {
    const { year } = req.params;

    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const start = new Date(Date.UTC(year, 0, 1));        // Jan 1 of year
    const end = new Date(Date.UTC(parseInt(year) + 1, 0, 1)); // Jan 1 of next year

    const result = await Expense.aggregate([
      {
        $match: {
          type: "expense",
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.month": 1 }
      }
    ]);

    const monthlyExpenses = Array(12).fill(0);
    result.forEach(({ _id, total }) => {
      monthlyExpenses[_id.month - 1] = total;
    });

    res.json({
      year: parseInt(year),
      monthlyExpenses, 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an expense by ID
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(id, updatedData, {
      new: true,            // Return the updated document
      runValidators: true,  // Validate the update against schema
    });

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
