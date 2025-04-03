module.exports = (req, res, next) => {
    res.locals.successMessage = req.flash('successMessage')[0] || null;
    res.locals.errorMessage = req.flash('errorMessage')[0] || null;
  
    // Clear the flash messages after setting them in res.locals
    req.flash('successMessage', '');
    req.flash('errorMessage', '');
  
    next();
  };