// Create a new router
const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    //searching in the database
    res.send("You searched for: " + req.query.keyword)
});

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // get all books from database
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.render("list.ejs", { availableBooks: result });
        }
    });
});

// displays form
router.get('/addbook', function (req, res, next) {
    res.render('addbook.ejs');
});

router.post('/bookadded', function (req, res, next) {
    // saves data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    let newrecord = [req.body.name, req.body.price];

    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.send('This book is added to database, name: ' + req.body.name + ' price ' + req.body.price);
        }
    });
});

router.get('/bargainbooks', function(req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20"; // get all books cheaper than £20
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("bargainbooks.ejs", { cheapBooks: result });
        }
    });
});


// Export the router object so index.js can access it
module.exports = router
