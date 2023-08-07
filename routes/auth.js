import { Router } from 'express';
import passport from 'passport';
const router = Router();
import { ensureAuthenticated } from '../middlewares/auth.js';
import User from '../models/user.js';
import mongoose from 'mongoose';
import methodOverride from 'method-override';



router.use(methodOverride('_method'));

// Login Page Route
router.get('/', (req, res) => {
  const message = req.query.message || ''; // Get the message from the query parameter, if available

  res.render('login',{ message });
});


// Login Handling Route
// router.post('/login', (req, res, next) => {
  
//   passport.authenticate('local', {
  
//     successRedirect: '/todos',
//     failureRedirect: '/login',
//   })(req, res, next);                              
// });


router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      // If the user is not found or the credentials are incorrect,
      // redirect back to the login page with an error message
      return res.redirect('/?message=Incorrect credentials');
    }

    // If the user is found and authenticated successfully,
    // log in the user and redirect them to the desired page
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.redirect('/todos');
    });
  })(req, res, next);
});


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Register Page Route
router.get('/register', (req, res) => {
  res.render('register');
});

// Register Handling Route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password});
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Todo = mongoose.model('Todo', todoSchema);


//@@@@@@@@@@@@@@@@@@
//get todo item
router.get('/todos', ensureAuthenticated, async(req, res) => {
  const todos = await Todo.find({ userId: req.user._id });
  // console.log(req.user);
  console.log("int auth.js file...........")

  res.render('todos', { user: req.user, todos }); // Pass the todos data to the todos.ejs template
});


//@@@@@@@@@@@
//post todo item
router.post('/todos', ensureAuthenticated, async(req, res) => {
  const itemName = req.body.title;
  // console.log(req.body);
  const newItem=new Todo({
    task :itemName,
    userId: req.user._id,
  });

  if(itemName!=""){
    newItem.save();//will save our item into the collection of Item
    res.redirect("/todos");
  }
  else {
    alert("Please Enter A Task");
    console.log("you Not Entered a Task")
  }
 
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//delete todo item route
router.delete('/todos/:id', ensureAuthenticated, async (req, res) => {
  try {
    const todoId = req.params.id;
console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$"+todoId);
    // Find the Todo item by ID and ensure it belongs to the authenticated user
    const todo = await Todo.findOneAndRemove({ _id: todoId, userId: req.user._id });

    if (!todo) {
      // If Todo not found or not owned by the user, return an error response
      return res.status(404).json({ error: 'Todo not found or not owned by the user' });
    }

    // Successfully deleted the Todo
    // res.status(200).json({ message: 'Todo deleted successfully' });
    res.redirect("/todos");
  } catch (err) {
    // If an error occurs, return an error response
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//@@@@@@@@@@@@@@@@@@@@@@@@@
// edit todo item
// Route to handle the PUT request for updating a todo item
router.put('/todos/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const todoId = req.params.id;
    const { task } = req.body;

console.log("in put todo 1 ....."+req.body.task)
    // Find the Todo item by ID and ensure it belongs to the authenticated user
    const todo = await Todo.findOneAndUpdate(
      { _id: todoId, userId: req.user._id },
      { task },
      { new: true }
    );

    if (!todo) {
      // If Todo not found or not owned by the user, return an error response
      return res.status(404).json({ error: 'Todo not found or not owned by the user' });
    }
    console.log("in put todo 2....."),

    // Successfully updated the Todo
    res.redirect('/todos'); // Redirect to the todo list page after successful update
  } catch (err) {
    // If an error occurs, return an error response
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Logout Route
router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;
