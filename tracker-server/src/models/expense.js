const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  category: { type: String, enum: ['food', 'transport', 'bills', 'entertainment','medicine', 'clothing', 'sanitary', 'others', ''] }, 
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number,  required: true},
  description: { type: String, required: true },
});

module.exports = mongoose.model('Expense', expenseSchema);
