export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      console.log("In ensureAuthenticated................. ")
      return next();
    }
    res.redirect('/login');
  }
  