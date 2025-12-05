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
// search results 
router.get('/search-result', function (req, res, next) {

    let keyword = req.query.keyword;

    if (!keyword || keyword.trim() === '') {
        return res.send("No keyword entered!");
    }

    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    let searchTerm = "%" + keyword.trim() + "%";

    db.query(sqlquery, [searchTerm], (err, result) => {
        if (err) next(err);

        if (result.length === 0) {
            return res.send(`
                <html>
                <body style="font-family: Arial, sans-serif; text-align:center; background:#f9f5f2; padding-top:50px; color:#4a3f35; line-height:1.6; font-size:18px;">                    <h2>No results found for "${keyword}" </h2>
                    <a href="/books/search" style="background:#d9b8a3;color:white;padding:10px 16px;border-radius:6px;text-decoration:none;">Search again</a>
                    <br><br>
                    <a href="/" style="background:#d9b8a3;color:white;padding:10px 16px;border-radius:6px;text-decoration:none;">Return Home</a>
                </body>
                </html>
            `);
        }

        // if theres a match show them results
        let list = result.map(book => `
            <tr>
              <td>${book.name}</td>
              <td>£${Number(book.price).toFixed(2)}</td>
            </tr>
        `).join("");

        res.send(`
            <html>
            <body style="font-family: Arial, sans-serif; text-align:center; background:#f9f5f2; padding-top:50px; color:#4a3f35; line-height:1.6; font-size:18px;">                <h2>Search results for "${keyword}" 🔍</h2>
                <table style="margin:auto;border-collapse:collapse;">
                    <tr>
                        <th style="padding:10px;">Book Name</th>
                        <th style="padding:10px;">Price</th>
                    </tr>
                    ${list}
                </table>
                <br>
                <a href="/books/search" style="background:#d9b8a3;color:white;padding:10px 16px;border-radius:6px;text-decoration:none;">New Search</a>
                <br><br>
                <a href="/" style="background:#d9b8a3;color:white;padding:10px 16px;border-radius:6px;text-decoration:none;">Return Home</a>
            </body>
            </html>
        `);
    });
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
