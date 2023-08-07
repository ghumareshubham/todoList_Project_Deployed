import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';

import { Strategy as LocalStrategy } from 'passport-local';
import { ensureAuthenticated } from './middlewares/auth.js';
import User from './models/user.js';

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

// Passport Config
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Routes
import authRoutes from './routes/auth.js';
app.use(authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});



// const mongoURL = "mongodb://0.0.0.0:27017/todoDB";
const mongoURL = "mongodb+srv://sghumare789:CBeh4KwVa0gks0aZ@cluster0.ssldc3j.mongodb.net/todoDB";



// Connect to MongoDB
mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true,useFindAndModify: false })
  .then(() => {
    console.log("Connected to MongoDB ....");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

