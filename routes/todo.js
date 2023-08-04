import { Router } from 'express';
const router = Router();
import { ensureAuthenticated } from '../middlewares/auth.js';

// Sample todo list data (Replace this with your database logic)
let todos = [
  { id: 1, task: 'Buy groceries' },
  { id: 2, task: 'Do laundry' },
  { id: 3, task: 'Clean the house' },
];

// Todo List Page
router.get('/todos', ensureAuthenticated, (req, res) => {
  console.log("int todo.js file...........")
  res.render('todos', { user: req.user, todos }); // Pass the todos data to the todos.ejs template
});

// Add Todo
router.post('/todos', ensureAuthenticated, (req, res) => {
  const { task } = req.body;
  const id = todos.length + 1;
  const newTodo = { id, task };
  todos.push(newTodo);
  res.redirect('/todos');
});

// Edit Todo
router.put('/todos/:id', ensureAuthenticated, (req, res) => {
  const id = parseInt(req.params.id);
  const { task } = req.body;
  const todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex !== -1) {
    todos[todoIndex].task = task;
  }
  res.redirect('/todos');
});

// Delete Todo
router.delete('/todos/:id/delete', ensureAuthenticated, (req, res) => {
  console.log("i am here................")
  const id = parseInt(req.params.id);
  todos = todos.filter((todo) => todo.id !== id);
  res.redirect('/todos');
});

export default router;
