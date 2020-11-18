let express = require('express');

// check if user is logged in
function isAuthenticated(req, res, next) { 
    if (req.isAuthenticated()) // if is authenticated, continue
        return next();
    res.redirect('/login'); // if not, redirect to the login page
}

// export function
module.exports = isAuthenticated;

