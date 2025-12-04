// Create a new router
const express = require("express")
const router = express.Router()

// Access control – only for protected routes
const redirectLogin = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.redirect('../users/login');
    }
    next();
};

// Search page - always accessible
router.get('/search', function(req, res, next){
    res.render("search.ejs")
});

// Search results - always accessible
router.get('/search-result', function (req, res, next) {
    res.send("You searched for: " + req.query.keyword)
});

// Book list - PUBLIC (no login required)
router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books";
    db.query(sqlquery, (err, result) => {
        if (err) next(err)
        else res.render("list.ejs", { availableBooks: result });
    });
});

// Bargains - PUBLIC (no login required)
router.get('/bargainbooks', function(req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";
    db.query(sqlquery, (err, result) => {
        if (err) next(err)
        else res.render("bargainbooks.ejs", { cheapBooks: result });
    });
});

// Add book form - LOGIN REQUIRED
router.get('/addbook', redirectLogin, function (req, res, next) {
    res.render('addbook.ejs');
});

// Insert book - LOGIN REQUIRED
router.post('/bookadded', redirectLogin, function (req, res, next) {
    let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    let newrecord = [req.body.name, req.body.price];

    db.query(sqlquery, newrecord, (err, result) => {
        if (err) next(err)
        else res.send('This book is added to database, name: ' + req.body.name + ' price ' + req.body.price);
    });
});

module.exports = router;
